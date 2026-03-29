// @ts-nocheck
/// <reference lib="deno.ns" />
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration - Allow all origins for development
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// Check environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('Missing required environment variables:', {
    SUPABASE_URL: !!supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
    SUPABASE_ANON_KEY: !!supabaseAnonKey
  });
}

// Supabase clients
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
);

const supabaseAnonClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Create storage buckets on startup
const initializeStorage = async () => {
  const applicationsBucket = 'make-53cfc738-applications';

  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === applicationsBucket);

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(applicationsBucket, { public: false });
    if (error) {
      console.error('Error creating applications bucket:', error);
    } else {
      console.log('Applications bucket created successfully');
    }
  }
};

// Initialize storage on startup
initializeStorage().catch(console.error);

// ============================================
// OPTIMIZED: In-memory cache for signed URLs
// Moved to top so it can be used by all endpoints
// ============================================
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();
const SIGNED_URL_CACHE_TTL = 3000 * 1000; // 50 minutes (URLs expire in 60 mins)

async function getSignedUrlCached(imagePath: string): Promise<string | null> {
  const cached = signedUrlCache.get(imagePath);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  try {
    const { data } = await supabase.storage
      .from('make-53cfc738-applications')
      .createSignedUrl(imagePath, 3600);

    if (data?.signedUrl) {
      signedUrlCache.set(imagePath, {
        url: data.signedUrl,
        expiresAt: Date.now() + SIGNED_URL_CACHE_TTL
      });
      return data.signedUrl;
    }
  } catch (err) {
    console.error(`Error getting signed URL for ${imagePath}:`, err);
  }
  return null;
}

// Batch sign multiple URLs in parallel
async function batchSignUrls(imagePaths: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const uncachedPaths: string[] = [];

  // Check cache first
  for (const path of imagePaths) {
    const cached = signedUrlCache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
      results.set(path, cached.url);
    } else {
      uncachedPaths.push(path);
    }
  }

  // Sign uncached URLs in parallel (batch of 20 to avoid rate limits)
  const BATCH_SIZE = 20;
  for (let i = 0; i < uncachedPaths.length; i += BATCH_SIZE) {
    const batch = uncachedPaths.slice(i, i + BATCH_SIZE);
    const signedUrls = await Promise.all(
      batch.map(async (path) => {
        try {
          const { data } = await supabase.storage
            .from('make-53cfc738-applications')
            .createSignedUrl(path, 3600);
          return { path, url: data?.signedUrl || null };
        } catch {
          return { path, url: null };
        }
      })
    );

    for (const { path, url } of signedUrls) {
      if (url) {
        signedUrlCache.set(path, {
          url,
          expiresAt: Date.now() + SIGNED_URL_CACHE_TTL
        });
        results.set(path, url);
      }
    }
  }

  return results;
}

// ============================================
// ULTRA-FAST: SQL-based talent endpoint (use this after running migration)
// This bypasses KV store and uses proper SQL indexes
// ============================================
app.get('/make-server-53cfc738/models/fast', async (c) => {
  try {
    const startTime = Date.now();
    const catalog = c.req.query('catalog');
    const subcategory = c.req.query('subcategory');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = (page - 1) * limit;

    console.log(`FAST SQL: Fetching talents (catalog=${catalog}, subcategory=${subcategory}, page=${page})`);

    // Build query
    let query = supabase
      .from('talents')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (catalog) {
      query = query.ilike('catalog', catalog);
    }
    if (subcategory) {
      query = query.ilike('subcategory', subcategory);
    }

    const { data: talents, error, count } = await query;

    if (error) {
      console.error('SQL query error:', error);
      throw error;
    }

    // Collect all image paths for batch signing (including videos)
    const allImagePaths: string[] = [];
    for (const talent of talents || []) {
      const imageUrls = talent.image_urls || talent.raw_data?.image_urls || talent.raw_data?.imageUrls || [];
      if (imageUrls.length > 0) {
        allImagePaths.push(...imageUrls);
      }
      const castingVideo = talent.casting_video_url || talent.raw_data?.casting_video_url || talent.raw_data?.castingVideoUrl;
      if (castingVideo) {
        allImagePaths.push(castingVideo);
      }
    }

    // Batch sign URLs in parallel
    const signedUrlMap = await batchSignUrls(allImagePaths);

    // Transform to match frontend expectations
    const models = (talents || []).map(t => {
      const imageUrls = t.image_urls || t.raw_data?.image_urls || t.raw_data?.imageUrls || [];
      const castingVideo = t.casting_video_url || t.raw_data?.casting_video_url || t.raw_data?.castingVideoUrl;

      return {
        id: t.id,
        name: `${t.first_name || t.raw_data?.firstName} ${t.last_name || t.raw_data?.lastName}`,
        firstName: t.first_name || t.raw_data?.firstName,
        lastName: t.last_name || t.raw_data?.lastName,
        email: t.email || t.raw_data?.email,
        gender: t.gender || t.raw_data?.gender,
        catalog: t.catalog || t.raw_data?.catalog,
        subcategory: t.subcategory || t.raw_data?.subcategory,
        nationality: t.nationality || t.raw_data?.nationality,
        location: t.location || t.country_of_residence || t.raw_data?.countryOfResidence,
        age: t.date_of_birth ? new Date().getFullYear() - new Date(t.date_of_birth).getFullYear() : null,
        imageUrls: imageUrls,
        signedImageUrls: imageUrls.map((url: string) => signedUrlMap.get(url)).filter(Boolean),
        castingVideoUrl: castingVideo,
        signedCastingVideoUrl: castingVideo ? signedUrlMap.get(castingVideo) : null,
        instagramURL: t.instagram_url || t.raw_data?.instagramURL,
        showreelURL: t.showreel_url || t.raw_data?.showreelURL,
        status: t.status,
        approvedAt: t.approved_at || t.raw_data?.approvedAt
      };
    });

    const totalTime = Date.now() - startTime;
    console.log(`FAST SQL: Returned ${models.length} talents in ${totalTime}ms`);

    return c.json({
      success: true,
      models: models,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      },
      _debug: { totalTimeMs: totalTime, source: 'sql' }
    });

  } catch (error) {
    console.error('FAST SQL error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch talents',
      error: error.message
    }, 500);
  }
});

// Application submission endpoint
app.post('/make-server-53cfc738/applications/submit', async (c) => {
  try {
    const formData = await c.req.formData();

    // Extract form fields
    const applicationData = {
      email: formData.get('email') as string,
      confirmEmail: formData.get('confirmEmail') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      gender: formData.get('gender') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      nationality: formData.get('nationality') as string,
      ethnicity: formData.get('ethnicity') as string,
      countryOfResidence: formData.get('countryOfResidence') as string,
      whatsAppNumber: formData.get('whatsAppNumber') as string,
      currentlyInUAE: formData.get('currentlyInUAE') as string,
      currentCountry: formData.get('currentCountry') as string,
      residenceTel: formData.get('residenceTel') as string,
      mobileUAE: formData.get('mobileUAE') as string,
      primaryLanguage: formData.get('primaryLanguage') as string,
      otherLanguages: formData.get('otherLanguages') as string,
      catalog: formData.get('catalog') as string,
      subcategory: formData.get('subcategory') as string,
      roleComment: formData.get('roleComment') as string,
      showreelURL: formData.get('showreelURL') as string,
      instagramURL: formData.get('instagramURL') as string,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    // Validate required fields
    if (!applicationData.email || !applicationData.firstName || !applicationData.lastName) {
      return c.json({ success: false, message: 'Required fields missing' }, 400);
    }

    if (!applicationData.catalog || !applicationData.subcategory) {
      return c.json({ success: false, message: 'Catalog and subcategory must be selected' }, 400);
    }

    // Handle video upload
    let castingVideoUrl = null;
    const castingVideo = formData.get('castingVideo') as File | null;
    if (castingVideo && castingVideo.size > 0) {
      const fileExt = castingVideo.name.split('.').pop() || 'mp4';
      const fileName = `${applicationData.id}/video_${crypto.randomUUID()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('make-53cfc738-applications')
        .upload(fileName, castingVideo, {
          contentType: castingVideo.type || 'video/mp4',
          upsert: false
        });
      if (error) {
        console.error('Video upload error:', error);
      } else {
        castingVideoUrl = fileName;
      }
    }

    // Handle image uploads
    const imageUrls: string[] = [];
    const images = formData.getAll('images') as File[];

    for (const image of images) {
      if (image && image.size > 0) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${applicationData.id}/${crypto.randomUUID()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('make-53cfc738-applications')
          .upload(fileName, image, {
            contentType: image.type,
            upsert: false
          });

        if (error) {
          console.error('Image upload error:', error);
        } else {
          imageUrls.push(fileName);
        }
      }
    }

    // Save application directly to SQL database
    const { error: sqlError } = await supabase.from('applications').insert({
      id: applicationData.id,
      created_at: applicationData.submittedAt,
      status: 'pending',
      catalog: applicationData.catalog,
      subcategory: applicationData.subcategory,
      first_name: applicationData.firstName,
      last_name: applicationData.lastName,
      email: applicationData.email,
      gender: applicationData.gender,
      date_of_birth: applicationData.dateOfBirth,
      nationality: applicationData.nationality,
      ethnicity: applicationData.ethnicity,
      country_of_residence: applicationData.countryOfResidence,
      whatsapp_number: applicationData.whatsAppNumber,
      mobile_uae: applicationData.mobileUAE,
      instagram_url: applicationData.instagramURL,
      showreel_url: applicationData.showreelURL,
      casting_video_url: castingVideoUrl,
      image_urls: imageUrls,
      raw_data: applicationData // Store full object as JSON backup
    });

    if (sqlError) {
      console.error('SQL insert error:', sqlError);
      return c.json({ success: false, message: 'Failed to save application' }, 500);
    }

    console.log(`New application submitted: ${applicationData.id} for ${applicationData.firstName} ${applicationData.lastName} (${applicationData.catalog} → ${applicationData.subcategory})`);

    return c.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return c.json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    }, 500);
  }
});

// Admin signup endpoint
app.post('/make-server-53cfc738/admin/signup', async (c) => {
  try {
    const { email, password, adminCode } = await c.req.json();

    // Verify admin code (you should set this as an environment variable)
    const validAdminCode = Deno.env.get('ADMIN_SIGNUP_CODE') || 'FAIZAAN2024ADMIN';
    if (adminCode !== validAdminCode) {
      return c.json({ success: false, message: 'Invalid admin code' }, 401);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Admin signup error:', error);
      return c.json({ success: false, message: error.message }, 400);
    }

    return c.json({
      success: true,
      message: 'Admin account created successfully',
      user: data.user
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    return c.json({
      success: false,
      message: 'Failed to create admin account',
      error: error.message
    }, 500);
  }
});

// Helper function to normalize old categories to new structure
interface ModelData {
  catalog?: string;
  role?: string;
  subcategory?: string;
  gender?: string;
  [key: string]: any;
}

function normalizeCatalogData(model: ModelData) {
  const originalCatalog = model.catalog;
  const originalRole = model.role;
  const originalSubcategory = model.subcategory;

  // Handle backward compatibility for old "Men" and "Women" categories
  if (model.catalog === 'Men' || model.catalog === 'Women') {
    console.log(`Normalizing: catalog "${model.catalog}" -> MODEL/${model.catalog}`);
    return {
      ...model,
      subcategory: model.catalog, // Move "Men" or "Women" to subcategory
      catalog: 'MODEL' // Set catalog to MODEL
    };
  }

  // Handle old "Models" category
  if (model.catalog === 'Models') {
    console.log(`Normalizing: catalog "Models" -> MODEL/${model.subcategory || 'Men'}`);
    return {
      ...model,
      catalog: 'MODEL',
      subcategory: model.subcategory || 'Men' // Default to Men if no subcategory
    };
  }

  // Handle old role field (if catalog is missing but role exists)
  if (!model.catalog && model.role) {
    if (model.role === 'Men' || model.role === 'Women') {
      console.log(`Normalizing: role "${model.role}" -> MODEL/${model.role}`);
      return {
        ...model,
        catalog: 'MODEL',
        subcategory: model.role
      };
    }
    // Handle other role values
    if (model.role === 'Model' || model.role === 'Models') {
      console.log(`Normalizing: role "${model.role}" -> MODEL/Men`);
      return {
        ...model,
        catalog: 'MODEL',
        subcategory: model.gender === 'Female' ? 'Women' : 'Men'
      };
    }
  }

  // Handle other old categories
  if (model.catalog === 'Cast') {
    console.log(`Normalizing: catalog "Cast" -> ACTOR/${model.subcategory || 'Men/Women'}`);
    return {
      ...model,
      catalog: 'ACTOR',
      subcategory: model.subcategory || 'Men/Women'
    };
  }

  if (model.catalog === 'Influencers') {
    console.log(`Normalizing: catalog "Influencers" -> SOCIAL MEDIA/Influencers`);
    return {
      ...model,
      catalog: 'SOCIAL MEDIA',
      subcategory: model.subcategory || 'Influencers'
    };
  }

  if (model.catalog === 'Stylists') {
    console.log(`Normalizing: catalog "Stylists" -> ARTIST/MUA/Hairstylist`);
    return {
      ...model,
      catalog: 'ARTIST',
      subcategory: model.subcategory || 'MUA/Hairstylist'
    };
  }

  if (model.catalog === 'Photographers') {
    console.log(`Normalizing: catalog "Photographers" -> PRODUCTION/Photo/Videographer`);
    return {
      ...model,
      catalog: 'PRODUCTION',
      subcategory: model.subcategory || 'Photo/Videographer'
    };
  }

  // If no normalization needed
  if (model.catalog && model.subcategory) {
    return model;
  }

  // Fallback: if we have catalog but no subcategory, try to infer from gender
  if (model.catalog && !model.subcategory) {
    console.log(`Warning: Model has catalog "${model.catalog}" but no subcategory. Inferring from gender.`);
    if (model.catalog === 'MODEL') {
      return {
        ...model,
        subcategory: model.gender === 'Female' ? 'Women' : 'Men'
      };
    }
  }

  return model;
}

// Migration endpoint to fix old data structure (admin only)
app.post('/make-server-53cfc738/admin/migrate-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    console.log('Starting data migration...');

    // Get all keys with prefix to find all applications and models
    const allApplicationKeys = await kv.getByPrefix('application:');
    const allApprovedModelKeys = await kv.getByPrefix('approved_model:');

    let migratedApps = 0;
    let migratedModels = 0;

    // Migrate applications
    for (const appKey of allApplicationKeys) {
      const app = appKey.value;
      if (app) {
        const normalized = normalizeCatalogData(app);
        if (JSON.stringify(normalized) !== JSON.stringify(app)) {
          await kv.set(appKey.key, normalized);
          migratedApps++;
          console.log(`Migrated application: ${appKey.key} - ${app.catalog || app.role} -> ${normalized.catalog}/${normalized.subcategory}`);
        }
      }
    }

    // Migrate approved models and rebuild category indexes
    const categoryIndexes = new Map();

    for (const modelKey of allApprovedModelKeys) {
      const model = modelKey.value;
      if (model) {
        const normalized = normalizeCatalogData(model);
        if (JSON.stringify(normalized) !== JSON.stringify(model)) {
          await kv.set(modelKey.key, normalized);
          migratedModels++;
          console.log(`Migrated model: ${modelKey.key} - ${model.catalog || model.role} -> ${normalized.catalog}/${normalized.subcategory}`);
        }

        // Rebuild category index
        const categoryKey = `approved_models:${normalized.catalog}:${normalized.subcategory}`;
        if (!categoryIndexes.has(categoryKey)) {
          categoryIndexes.set(categoryKey, []);
        }
        const modelId = modelKey.key.replace('approved_model:', '');
        categoryIndexes.get(categoryKey).push(modelId);
      }
    }

    // Update all category indexes
    for (const [categoryKey, modelIds] of categoryIndexes.entries()) {
      await kv.set(categoryKey, modelIds);
      console.log(`Updated category index: ${categoryKey} with ${modelIds.length} models`);
    }

    console.log(`Migration complete: ${migratedApps} applications, ${migratedModels} models migrated`);

    return c.json({
      success: true,
      message: 'Data migration completed',
      stats: {
        migratedApplications: migratedApps,
        migratedModels: migratedModels,
        categoryIndexes: categoryIndexes.size
      }
    });

  } catch (error) {
    console.error('Data migration error:', error);
    return c.json({
      success: false,
      message: 'Failed to migrate data',
      error: error.message
    }, 500);
  }
});

// NEW: Sync approved applications to talents table
app.post('/make-server-53cfc738/admin/sync-approved-to-talents', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    console.log('Syncing approved applications to talents table...');

    // Get all approved applications from SQL
    const { data: approvedApps, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'approved');

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return c.json({ success: false, message: 'Failed to fetch approved applications' }, 500);
    }

    console.log(`Found ${approvedApps?.length || 0} approved applications to sync...`);

    let syncedCount = 0;
    let errorCount = 0;
    const failedRecords: string[] = [];

    // Process each record individually to avoid batch failures
    for (const app of approvedApps || []) {
      try {
        // Get catalog and subcategory with fallbacks
        let catalog = app.catalog || app.raw_data?.catalog;
        let subcategory = app.subcategory || app.raw_data?.subcategory;

        // If still missing, try to infer from role or other fields
        if (!catalog || !subcategory) {
          const role = app.raw_data?.role || app.role;
          const gender = app.gender || app.raw_data?.gender;

          // Default to Models category if missing
          if (!catalog) {
            if (role === 'Men' || role === 'Women' || role === 'Model' || role === 'Models') {
              catalog = 'Models';
            } else {
              catalog = 'Models'; // Default fallback
            }
          }

          if (!subcategory) {
            if (role === 'Men' || role === 'Women') {
              subcategory = role;
            } else if (gender === 'Male' || gender === 'male') {
              subcategory = 'Men';
            } else if (gender === 'Female' || gender === 'female') {
              subcategory = 'Women';
            } else {
              subcategory = 'Men'; // Default fallback
            }
          }
        }

        // Normalize catalog data using the existing function
        const normalized = normalizeCatalogData({ catalog, subcategory, gender: app.gender || app.raw_data?.gender });

        const talentData = {
          id: app.id,
          first_name: app.first_name || app.raw_data?.firstName || 'Unknown',
          last_name: app.last_name || app.raw_data?.lastName || 'Talent',
          email: app.email || app.raw_data?.email,
          gender: app.gender || app.raw_data?.gender,
          date_of_birth: app.date_of_birth || app.raw_data?.dateOfBirth,
          nationality: app.nationality || app.raw_data?.nationality,
          catalog: normalized.catalog,
          subcategory: normalized.subcategory,
          country_of_residence: app.country_of_residence || app.raw_data?.countryOfResidence,
          location: app.location || app.raw_data?.location || app.country_of_residence || app.raw_data?.countryOfResidence,
          whatsapp_number: app.whatsapp_number || app.raw_data?.whatsAppNumber,
          mobile_uae: app.mobile_uae || app.raw_data?.mobileUAE,
          instagram_url: app.instagram_url || app.raw_data?.instagramURL,
          showreel_url: app.showreel_url || app.raw_data?.showreelURL,
          casting_video_url: app.casting_video_url || app.raw_data?.castingVideoUrl,
          image_urls: app.image_urls || app.raw_data?.imageUrls || [],
          status: 'approved',
          approved_at: app.approved_at || new Date().toISOString(),
          raw_data: {
            ...(app.raw_data || app),
            casting_video_url: app.casting_video_url || app.raw_data?.castingVideoUrl
          }
        };

        const { error: upsertError } = await supabase
          .from('talents')
          .upsert(talentData);

        if (upsertError) {
          console.error(`Failed to sync ${app.id} (${app.first_name || app.raw_data?.firstName}):`, upsertError.message);
          errorCount++;
          failedRecords.push(`${app.id}: ${upsertError.message}`);
        } else {
          syncedCount++;
        }
      } catch (recordError) {
        console.error(`Exception syncing ${app.id}:`, recordError);
        errorCount++;
        failedRecords.push(`${app.id}: ${recordError.message}`);
      }
    }

    console.log(`Sync complete: ${syncedCount} talents synced, ${errorCount} errors`);
    if (failedRecords.length > 0) {
      console.log('Failed records:', failedRecords.slice(0, 10)); // Log first 10 failures
    }

    return c.json({
      success: true,
      message: `Synced ${syncedCount} approved applications to talents table`,
      stats: {
        total: approvedApps?.length || 0,
        synced: syncedCount,
        failed: errorCount
      },
      failedRecords: failedRecords.slice(0, 20) // Return first 20 failures for debugging
    });

  } catch (error) {
    console.error('Sync error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Migration endpoint to sync KV to SQL (Non-destructive)
app.post('/make-server-53cfc738/admin/migrate-kv-to-sql', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    console.log('Starting SAFE KV -> SQL migration (Copy Only)...');

    // Get ALL applications from KV
    const allApplicationKeys = await kv.getByPrefix('application:');
    console.log(`Found ${allApplicationKeys.length} applications to migrate.`);

    let migratedCount = 0;
    let errorCount = 0;

    // Process in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < allApplicationKeys.length; i += BATCH_SIZE) {
      const chunk = allApplicationKeys.slice(i, i + BATCH_SIZE);
      const records = chunk.map(k => {
        const app = k.value;
        // Map KV fields to SQL columns
        return {
          id: app.id,
          created_at: app.submittedAt || new Date().toISOString(),
          status: app.status || 'pending',
          catalog: app.catalog,
          subcategory: app.subcategory,
          gender: app.gender,
          nationality: app.nationality,
          country_of_residence: app.countryOfResidence,
          first_name: app.firstName,
          last_name: app.lastName,
          email: app.email,
          // FIXED: Include image_urls for proper display
          image_urls: app.imageUrls || [],
          casting_video_url: app.castingVideoUrl,
          instagram_url: app.instagramURL,
          showreel_url: app.showreelURL,
          whatsapp_number: app.whatsAppNumber,
          date_of_birth: app.dateOfBirth,
          raw_data: app // Store complete original object as backup
        };
      });

      const { error } = await supabase.from('applications').upsert(records);

      if (error) {
        console.error('Migration batch error:', error);
        errorCount += chunk.length;
      } else {
        migratedCount += chunk.length;
      }
    }

    console.log(`Migration complete: ${migratedCount} success, ${errorCount} failed.`);

    return c.json({
      success: true,
      message: 'Migration completed',
      stats: {
        total: allApplicationKeys.length,
        migrated: migratedCount,
        failed: errorCount
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all applications (admin only) - Supports ?source=sql for testing
app.get('/make-server-53cfc738/admin/applications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    const source = c.req.query('source');

    // NEW FAST PATH: Fetch from SQL if requested
    if (source === 'sql') {
      const startTime = Date.now();
      console.log('==== FETCHING APPLICATIONS FROM SQL (FAST) ====');
      const { data: applications, error, count } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Collect all image paths for batch signing
      const allImagePaths: string[] = [];
      for (const app of applications || []) {
        // Check both image_urls column and raw_data.imageUrls
        const imageUrls = app.image_urls || app.raw_data?.imageUrls || [];
        if (imageUrls.length > 0) {
          allImagePaths.push(...imageUrls);
        }
        const castingVideo = app.casting_video_url || app.raw_data?.castingVideoUrl;
        if (castingVideo) {
          allImagePaths.push(castingVideo);
        }
      }

      console.log(`Signing ${allImagePaths.length} images in parallel...`);

      // Batch sign all URLs in parallel (FAST!)
      const signedUrlMap = await batchSignUrls(allImagePaths);

      // Transform back to match frontend expectations
      const mappedApps = (applications || []).map(app => {
        const imageUrls = app.image_urls || app.raw_data?.imageUrls || [];
        const signedImageUrls = imageUrls.map((url: string) => signedUrlMap.get(url)).filter(Boolean);
        const castingVideo = app.casting_video_url || app.raw_data?.castingVideoUrl;

        return {
          ...app.raw_data, // Spread original data first
          ...app,          // Override with optimized columns
          // Map SQL column names back to frontend expected names
          imageUrls: imageUrls,
          signedImageUrls: signedImageUrls,
          castingVideoUrl: castingVideo,
          signedCastingVideoUrl: castingVideo ? signedUrlMap.get(castingVideo) : null,
          firstName: app.first_name || app.raw_data?.firstName,
          lastName: app.last_name || app.raw_data?.lastName,
          submissionDate: app.created_at,
          submittedAt: app.created_at
        };
      });

      const totalTime = Date.now() - startTime;
      console.log(`FAST SQL: Returned ${mappedApps.length} applications in ${totalTime}ms`);

      return c.json({
        success: true,
        applications: mappedApps,
        stats: {
          total: count,
          pending: applications.filter(a => a.status === 'pending').length,
          approved: applications.filter(a => a.status === 'approved').length,
          rejected: applications.filter(a => a.status === 'rejected').length
        },
        source: 'sql',
        _debug: { totalTimeMs: totalTime }
      });
    }

    // OLD SLOW PATH: Fetch from KV
    console.log('==== FETCHING ALL APPLICATIONS FOR ADMIN (KV STORE) ====');
    console.log('Admin user:', user.email);

    // Get ALL applications by scanning the KV store with prefix
    const allApplicationKeys = await kv.getByPrefix('application:');
    console.log(`[KV Store] Found ${allApplicationKeys.length} application records`);

    if (allApplicationKeys.length > 0) {
      console.log('[KV Store] Sample keys:', allApplicationKeys.slice(0, 3).map(k => k.key));
    } else {
      console.log('[KV Store] WARNING: No applications found in database!');
      console.log('[KV Store] This could mean:');
      console.log('  1. No applications have been submitted yet');
      console.log('  2. Applications were submitted but not saved to KV store');
      console.log('  3. There is an issue with the KV store connection');
    }

    // Get list-based IDs for stats
    const pendingIds = await kv.get('applications:pending') || [];
    const approvedIds = await kv.get('applications:approved') || [];
    const rejectedIds = await kv.get('applications:rejected') || [];

    console.log('[Status Lists] Pending IDs:', pendingIds.length, 'Approved IDs:', approvedIds.length, 'Rejected IDs:', rejectedIds.length);

    // Process all applications
    const applications = [];
    let normalizedCount = 0;
    for (const appKey of allApplicationKeys) {
      let app = appKey.value;
      if (app) {
        const originalCatalog = app.catalog;
        // Normalize catalog data for backward compatibility
        app = normalizeCatalogData(app);
        if (app.catalog !== originalCatalog) {
          normalizedCount++;
          console.log(`[Normalization] ${appKey.key}: "${originalCatalog}" -> "${app.catalog}/${app.subcategory}"`);
        }

        // Get signed URLs for images
        if (app.imageUrls && app.imageUrls.length > 0) {
          app.signedImageUrls = [];
          for (const imageUrl of app.imageUrls) {
            try {
              const { data } = await supabase.storage
                .from('make-53cfc738-applications')
                .createSignedUrl(imageUrl, 3600); // 1 hour expiry
              if (data) {
                app.signedImageUrls.push(data.signedUrl);
              }
            } catch (err) {
              console.error(`Error getting signed URL for ${imageUrl}:`, err);
            }
          }
        }

        applications.push(app);
      } else {
        console.warn(`[WARNING] Key ${appKey.key} has no value`);
      }
    }

    console.log(`[Result] Returning ${applications.length} applications (${normalizedCount} normalized on-the-fly)`);

    // Log category distribution
    const categoryDistribution = {};
    applications.forEach(app => {
      const key = `${app.catalog || 'NONE'}/${app.subcategory || 'NONE'}`;
      categoryDistribution[key] = (categoryDistribution[key] || 0) + 1;
    });
    console.log('[Category Distribution]:', categoryDistribution);

    // Log status distribution
    const statusDistribution = {
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
    console.log('[Status Distribution]:', statusDistribution);
    console.log('==== ADMIN APPLICATIONS FETCH COMPLETE ====\n');

    return c.json({
      success: true,
      applications: applications,
      stats: {
        total: applications.length,
        pending: statusDistribution.pending,
        approved: statusDistribution.approved,
        rejected: statusDistribution.rejected
      },
      source: 'kv'
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    }, 500);
  }
});

// Approve application (admin only)
app.post('/make-server-53cfc738/admin/applications/:id/approve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    const applicationId = c.req.param('id');
    const { notes } = await c.req.json();
    const source = c.req.query('source');

    // SQL PATH: Update in SQL tables
    if (source === 'sql') {
      console.log(`Approving application ${applicationId} in SQL...`);

      // Get the application from SQL
      const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (fetchError || !app) {
        return c.json({ success: false, message: 'Application not found in SQL' }, 404);
      }

      // Update application status in SQL
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          admin_notes: notes || ''
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('SQL update error:', updateError);
        return c.json({ success: false, message: 'Failed to update application' }, 500);
      }

      // Add to talents table
      const talentData = {
        id: app.id,
        first_name: app.first_name || app.raw_data?.firstName,
        last_name: app.last_name || app.raw_data?.lastName,
        email: app.email,
        gender: app.gender || app.raw_data?.gender,
        date_of_birth: app.date_of_birth || app.raw_data?.dateOfBirth,
        nationality: app.nationality || app.raw_data?.nationality,
        catalog: app.catalog,
        subcategory: app.subcategory,
        country_of_residence: app.country_of_residence || app.raw_data?.countryOfResidence,
        whatsapp_number: app.whatsapp_number || app.raw_data?.whatsAppNumber,
        mobile_uae: app.mobile_uae || app.raw_data?.mobileUAE,
        instagram_url: app.instagram_url || app.raw_data?.instagramURL,
        showreel_url: app.showreel_url || app.raw_data?.showreelURL,
        casting_video_url: app.casting_video_url || app.raw_data?.castingVideoUrl,
        image_urls: app.image_urls || app.raw_data?.imageUrls || [],
        status: 'approved',
        approved_at: new Date().toISOString(),
        raw_data: {
          ...(app.raw_data || app),
          casting_video_url: app.casting_video_url || app.raw_data?.castingVideoUrl
        }
      };

      const { error: talentError } = await supabase
        .from('talents')
        .upsert(talentData);

      if (talentError) {
        console.error('Talent insert error:', talentError);
        // Don't fail if talent insert fails, application is still approved
      }

      console.log(`Application approved in SQL: ${applicationId}`);
      return c.json({
        success: true,
        message: 'Application approved successfully'
      });
    }

    // KV PATH (Legacy): Keep for backward compatibility
    const application = await kv.get(`application:${applicationId}`);
    if (!application) {
      return c.json({ success: false, message: 'Application not found' }, 404);
    }

    // Update application status
    application.status = 'approved';
    application.approvedAt = new Date().toISOString();
    application.approvedBy = user.id;
    application.adminNotes = notes || '';

    // Save updated application
    await kv.set(`application:${applicationId}`, application);

    // Move from pending to approved
    const pendingIds = await kv.get('applications:pending') || [];
    const approvedIds = await kv.get('applications:approved') || [];

    const updatedPending = pendingIds.filter(id => id !== applicationId);
    const updatedApproved = [...approvedIds, applicationId];

    await kv.set('applications:pending', updatedPending);
    await kv.set('applications:approved', updatedApproved);

    // Add to approved models list for website display with catalog and subcategory
    const approvedModel = {
      id: applicationId,
      name: `${application.firstName} ${application.lastName}`,
      email: application.email,
      catalog: application.catalog,
      subcategory: application.subcategory,
      nationality: application.nationality,
      gender: application.gender,
      age: application.dateOfBirth ? new Date().getFullYear() - new Date(application.dateOfBirth).getFullYear() : null,
      location: application.countryOfResidence,
      imageUrls: application.imageUrls,
      instagramURL: application.instagramURL,
      showreelURL: application.showreelURL,
      languages: [application.primaryLanguage, application.otherLanguages].filter(Boolean),
      status: 'Available',
      approvedAt: application.approvedAt
    };

    await kv.set(`approved_model:${applicationId}`, approvedModel);

    // Add to category-specific index for easier querying
    const categoryKey = `approved_models:${application.catalog}:${application.subcategory}`;
    const categoryModels = await kv.get(categoryKey) || [];
    if (!categoryModels.includes(applicationId)) {
      categoryModels.push(applicationId);
      await kv.set(categoryKey, categoryModels);
    }

    console.log(`Application approved: ${applicationId} for ${application.firstName} ${application.lastName} (${application.catalog} → ${application.subcategory})`);

    return c.json({
      success: true,
      message: 'Application approved successfully'
    });

  } catch (error) {
    console.error('Application approval error:', error);
    return c.json({
      success: false,
      message: 'Failed to approve application',
      error: error.message
    }, 500);
  }
});

// Reject application (admin only)
app.post('/make-server-53cfc738/admin/applications/:id/reject', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    const applicationId = c.req.param('id');
    const { notes } = await c.req.json();
    const source = c.req.query('source');

    // SQL PATH: Update in SQL tables
    if (source === 'sql') {
      console.log(`Rejecting application ${applicationId} in SQL...`);

      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          admin_notes: notes || ''
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('SQL update error:', updateError);
        return c.json({ success: false, message: 'Failed to update application' }, 500);
      }

      console.log(`Application rejected in SQL: ${applicationId}`);
      return c.json({
        success: true,
        message: 'Application rejected successfully'
      });
    }

    // KV PATH (Legacy): Keep for backward compatibility
    const application = await kv.get(`application:${applicationId}`);
    if (!application) {
      return c.json({ success: false, message: 'Application not found' }, 404);
    }

    // Update application status
    application.status = 'rejected';
    application.rejectedAt = new Date().toISOString();
    application.rejectedBy = user.id;
    application.adminNotes = notes || '';

    // Save updated application
    await kv.set(`application:${applicationId}`, application);

    // Move from pending to rejected
    const pendingIds = await kv.get('applications:pending') || [];
    const rejectedIds = await kv.get('applications:rejected') || [];

    const updatedPending = pendingIds.filter(id => id !== applicationId);
    const updatedRejected = [...rejectedIds, applicationId];

    await kv.set('applications:pending', updatedPending);
    await kv.set('applications:rejected', updatedRejected);

    console.log(`Application rejected: ${applicationId} for ${application.firstName} ${application.lastName}`);

    return c.json({
      success: true,
      message: 'Application rejected successfully'
    });

  } catch (error) {
    console.error('Application rejection error:', error);
    return c.json({
      success: false,
      message: 'Failed to reject application',
      error: error.message
    }, 500);
  }
});

// Delete application (admin only)
app.delete('/make-server-53cfc738/admin/applications/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || user.user_metadata?.role !== 'admin') {
      return c.json({ success: false, message: 'Unauthorized access' }, 401);
    }

    const applicationId = c.req.param('id');
    const source = c.req.query('source');

    // SQL PATH: Delete from SQL tables
    if (source === 'sql') {
      console.log(`Deleting application ${applicationId} from SQL...`);

      // Get the application first to get image URLs
      const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (fetchError || !app) {
        return c.json({ success: false, message: 'Application not found in SQL' }, 404);
      }

      // Delete images from storage if they exist
      const imageUrls = app.image_urls || app.raw_data?.imageUrls || [];
      if (imageUrls.length > 0) {
        for (const imageUrl of imageUrls) {
          try {
            await supabase.storage
              .from('make-53cfc738-applications')
              .remove([imageUrl]);
          } catch (imageError) {
            console.error(`Failed to delete image ${imageUrl}:`, imageError);
          }
        }
      }

      // Delete from talents table if it was approved
      if (app.status === 'approved') {
        await supabase.from('talents').delete().eq('id', applicationId);
      }

      // Delete from applications table
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (deleteError) {
        console.error('SQL delete error:', deleteError);
        return c.json({ success: false, message: 'Failed to delete application' }, 500);
      }

      console.log(`Application deleted from SQL: ${applicationId}`);
      return c.json({
        success: true,
        message: 'Application deleted successfully'
      });
    }

    // KV PATH (Legacy): Keep for backward compatibility
    const application = await kv.get(`application:${applicationId}`);
    if (!application) {
      return c.json({ success: false, message: 'Application not found' }, 404);
    }

    // Delete images from storage if they exist
    if (application.imageUrls && application.imageUrls.length > 0) {
      for (const imageUrl of application.imageUrls) {
        try {
          await supabase.storage
            .from('make-53cfc738-applications')
            .remove([imageUrl]);
        } catch (imageError) {
          console.error(`Failed to delete image ${imageUrl}:`, imageError);
          // Continue with deletion even if image deletion fails
        }
      }
    }

    // Remove from all status lists
    const pendingIds = await kv.get('applications:pending') || [];
    const approvedIds = await kv.get('applications:approved') || [];
    const rejectedIds = await kv.get('applications:rejected') || [];

    const updatedPending = pendingIds.filter(id => id !== applicationId);
    const updatedApproved = approvedIds.filter(id => id !== applicationId);
    const updatedRejected = rejectedIds.filter(id => id !== applicationId);

    await kv.set('applications:pending', updatedPending);
    await kv.set('applications:approved', updatedApproved);
    await kv.set('applications:rejected', updatedRejected);

    // If it was approved, remove from approved models and category indexes
    if (application.status === 'approved') {
      await kv.del(`approved_model:${applicationId}`);

      // Remove from category-specific index
      const categoryKey = `approved_models:${application.catalog}:${application.subcategory}`;
      const categoryModels = await kv.get(categoryKey) || [];
      const updatedCategoryModels = categoryModels.filter(id => id !== applicationId);

      if (updatedCategoryModels.length > 0) {
        await kv.set(categoryKey, updatedCategoryModels);
      } else {
        await kv.del(categoryKey);
      }
    }

    // Delete the main application record
    await kv.del(`application:${applicationId}`);

    console.log(`Application deleted: ${applicationId} for ${application.firstName} ${application.lastName} (${application.catalog} → ${application.subcategory})`);

    return c.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Application deletion error:', error);
    return c.json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    }, 500);
  }
});

// ============================================
// OPTIMIZED: Get approved models for website display
// ============================================
app.get('/make-server-53cfc738/models/approved', async (c) => {
  try {
    const startTime = Date.now();
    console.log('Fetching all approved models (OPTIMIZED)...');

    // Get ALL approved models by scanning the KV store
    const allApprovedModelKeys = await kv.getByPrefix('approved_model:');
    console.log(`Found ${allApprovedModelKeys.length} approved models in KV store (${Date.now() - startTime}ms)`);

    // Step 1: Extract and normalize all models (fast)
    const models = allApprovedModelKeys
      .map(modelKey => modelKey.value)
      .filter(Boolean)
      .map(model => normalizeCatalogData(model));

    console.log(`Normalized ${models.length} models (${Date.now() - startTime}ms)`);

    // Step 2: Collect ALL image paths that need signing
    const allImagePaths: string[] = [];
    for (const model of models) {
      if (model.imageUrls && model.imageUrls.length > 0) {
        allImagePaths.push(...model.imageUrls);
      }
    }

    console.log(`Signing ${allImagePaths.length} images in parallel...`);

    // Step 3: Batch sign all URLs in parallel (THE KEY OPTIMIZATION)
    const signedUrlMap = await batchSignUrls(allImagePaths);

    console.log(`Signed ${signedUrlMap.size} URLs (${Date.now() - startTime}ms)`);

    // Step 4: Attach signed URLs to models
    for (const model of models) {
      model.signedImageUrls = [];
      if (model.imageUrls) {
        for (const imageUrl of model.imageUrls) {
          const signedUrl = signedUrlMap.get(imageUrl);
          if (signedUrl) {
            model.signedImageUrls.push(signedUrl);
          }
        }
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`OPTIMIZED: Returning ${models.length} approved models in ${totalTime}ms`);

    return c.json({
      success: true,
      models: models,
      _debug: { totalTimeMs: totalTime, modelCount: models.length, imageCount: allImagePaths.length }
    });

  } catch (error) {
    console.error('Get approved models error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch approved models',
      error: error.message
    }, 500);
  }
});

// OPTIMIZED: Get approved models by category and subcategory
app.get('/make-server-53cfc738/models/approved/:category/:subcategory', async (c) => {
  try {
    const startTime = Date.now();
    const category = c.req.param('category');
    const subcategory = c.req.param('subcategory');

    console.log(`Fetching approved models for ${category} → ${subcategory} (OPTIMIZED)...`);

    // Get ALL approved models and filter
    const allApprovedModelKeys = await kv.getByPrefix('approved_model:');

    // Filter and normalize in one pass
    const models = allApprovedModelKeys
      .map(modelKey => modelKey.value)
      .filter(Boolean)
      .map(model => normalizeCatalogData(model))
      .filter(model => model.catalog === category && model.subcategory === subcategory);

    // Collect all image paths
    const allImagePaths: string[] = [];
    for (const model of models) {
      if (model.imageUrls?.length > 0) {
        allImagePaths.push(...model.imageUrls);
      }
    }

    // Batch sign all URLs in parallel
    const signedUrlMap = await batchSignUrls(allImagePaths);

    // Attach signed URLs
    for (const model of models) {
      model.signedImageUrls = (model.imageUrls || []).map(url => signedUrlMap.get(url)).filter(Boolean);
    }

    console.log(`Found ${models.length} models for ${category} → ${subcategory} in ${Date.now() - startTime}ms`);

    return c.json({
      success: true,
      models: models,
      category: category,
      subcategory: subcategory,
      count: models.length
    });

  } catch (error) {
    console.error('Get approved models by category error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch approved models by category',
      error: error.message
    }, 500);
  }
});

// OPTIMIZED: Get approved models by category (all subcategories)
app.get('/make-server-53cfc738/models/approved/:category', async (c) => {
  try {
    const startTime = Date.now();
    const category = c.req.param('category');

    console.log(`Fetching all approved models for category: ${category} (OPTIMIZED)...`);

    // Get all approved models and filter by category
    const allApprovedModelKeys = await kv.getByPrefix('approved_model:');

    const models = allApprovedModelKeys
      .map(modelKey => modelKey.value)
      .filter(Boolean)
      .map(model => normalizeCatalogData(model))
      .filter(model => model.catalog === category);

    // Collect all image paths
    const allImagePaths: string[] = [];
    for (const model of models) {
      if (model.imageUrls?.length > 0) {
        allImagePaths.push(...model.imageUrls);
      }
    }

    // Batch sign all URLs in parallel
    const signedUrlMap = await batchSignUrls(allImagePaths);

    // Attach signed URLs and group by subcategory
    const modelsBySubcategory: Record<string, any[]> = {};
    for (const model of models) {
      model.signedImageUrls = (model.imageUrls || []).map(url => signedUrlMap.get(url)).filter(Boolean);

      if (!modelsBySubcategory[model.subcategory]) {
        modelsBySubcategory[model.subcategory] = [];
      }
      modelsBySubcategory[model.subcategory].push(model);
    }

    console.log(`Found ${models.length} models for ${category} in ${Date.now() - startTime}ms`);

    return c.json({
      success: true,
      models: models,
      modelsBySubcategory: modelsBySubcategory,
      category: category,
      count: models.length
    });

  } catch (error) {
    console.error('Get approved models by category error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch approved models by category',
      error: error.message
    }, 500);
  }
});

// OPTIMIZED: Get models by IDs (for favorites)
app.post('/make-server-53cfc738/models/by-ids', async (c) => {
  try {
    const startTime = Date.now();
    const { ids } = await c.req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ success: false, message: 'Invalid or empty IDs array' }, 400);
    }

    // Fetch all models in parallel using mget
    const modelKeys = ids.map(id => `approved_model:${id}`);
    const rawModels = await kv.mget(modelKeys);

    const models = rawModels.filter(Boolean).map(model => normalizeCatalogData(model));

    // Collect all image paths
    const allImagePaths: string[] = [];
    for (const model of models) {
      if (model.imageUrls?.length > 0) {
        allImagePaths.push(...model.imageUrls);
      }
    }

    // Batch sign all URLs in parallel
    const signedUrlMap = await batchSignUrls(allImagePaths);

    // Attach signed URLs
    for (const model of models) {
      model.signedImageUrls = (model.imageUrls || []).map(url => signedUrlMap.get(url)).filter(Boolean);
    }

    console.log(`Fetched ${models.length} models by IDs in ${Date.now() - startTime}ms`);

    return c.json({
      success: true,
      models: models
    });

  } catch (error) {
    console.error('Get models by IDs error:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch models by IDs',
      error: error.message
    }, 500);
  }
});

// Health check
app.get('/make-server-53cfc738/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);