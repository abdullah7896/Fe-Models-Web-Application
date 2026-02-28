# Deployment Instructions for Faizaan Events Models

## ✨ NEW: Previous Talent & Registrations Will Automatically Appear!

**Good News**: All your previous talent entries (Men, Women, Models) and applications will **automatically** show up after deploying the edge function!

### How It Works:
- ✅ Old "Men" entries → Shown in MODEL / Men category
- ✅ Old "Women" entries → Shown in MODEL / Women category  
- ✅ All previous registrations → Visible in admin dashboard
- ✅ **No manual work required** - happens automatically!

### Optional: Permanent Migration
Use the **"Migrate Old Data"** button in the admin dashboard to permanently convert old data to the new structure for better performance.

---

## ⚠️ IMPORTANT: Edge Function Must Be Deployed

The "Failed to fetch" errors occur because the Supabase Edge Function isn't deployed yet. Follow these steps to fix the errors:

## Quick Fix (3 Steps)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login and Link Project

```bash
supabase login
supabase link --project-ref pggyqrqgyoehftdmnswa
```

### 3. Deploy the Edge Function

```bash
cd supabase/functions
supabase functions deploy server
```

## Set Environment Variables

After deployment, set these environment variables in your Supabase Dashboard:

Go to: **Project Settings → Edge Functions → server → Environment Variables**

Set these variables:
- `SUPABASE_URL` = `https://pggyqrqgyoehftdmnswa.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (Get from Project Settings → API → service_role key)
- `SUPABASE_ANON_KEY` = (Get from Project Settings → API → anon/public key)  
- `ADMIN_SIGNUP_CODE` = `FAIZAAN2024ADMIN` (or your custom code)

OR use the CLI:

```bash
supabase secrets set SUPABASE_URL=https://pggyqrqgyoehftdmnswa.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
supabase secrets set SUPABASE_ANON_KEY=your-anon-key-here
supabase secrets set ADMIN_SIGNUP_CODE=FAIZAAN2024ADMIN
```

## Verify Deployment

1. Check the **Health Check** on the admin login page
2. It should show: **✅ Server is healthy**
3. If errors persist, check the troubleshooting section below

## Creating Your First Admin Account

1. Go to `/admin` route on your website
2. Click **"Need to create an admin account?"**
3. Enter your email and password
4. Use the admin signup code: `FAIZAAN2024ADMIN`
5. Click **"Create Account"**
6. You'll be automatically logged in

## How the System Works

### Data Flow

1. **Applications**: Users submit via the "Apply Now" form
2. **Storage**: All data stored in Supabase KV Store with keys like `application:{id}`
3. **Admin Dashboard**: Fetches ALL applications using `kv.getByPrefix('application:')`
4. **Approval**: When approved, creates `approved_model:{id}` entry
5. **Website Display**: Models shown based on catalog/subcategory filters

### Automatic Backward Compatibility

The server automatically handles old data formats:
- Old `Men`/`Women` categories → `MODEL` catalog with `Men`/`Women` subcategory
- No manual migration needed!
- Data is normalized on-the-fly when fetched

## Category Structure

The website uses 6 main categories with subcategories:

1. **MODEL**: Men, Women, Kids, Old
2. **PRODUCTION**: VFX/Editors, DOP, Photo/Videographer, Studio/Equipments
3. **ACTOR**: Men/Women, Kids/Teens, Mature, Fitness, GCC Nationals
4. **SOCIAL MEDIA**: Content Creators, YouTubers, TikTokers, Influencers
5. **ARTIST**: MUA/Hairstylist, Heena Artist, Wardrobe Stylist, Set Designer
6. **TALENT**: Hostesses, Promoters, Translators, Bouncers, Designers, Mix Talents

### How Old Data is Handled

- **Old "Men" catalog** → becomes `MODEL` catalog / `Men` subcategory
- **Old "Women" catalog** → becomes `MODEL` catalog / `Women` subcategory
- **Old "Models" catalog** → becomes `MODEL` catalog
- **Old "Cast" catalog** → becomes `ACTOR` catalog
- **Old "Influencers"** → becomes `SOCIAL MEDIA` catalog

This happens automatically - no manual migration required!

## Troubleshooting

### "Failed to fetch" errors

**Cause**: Edge function not deployed or not responding

**Fix**:
1. Deploy the edge function: `supabase functions deploy server`
2. Check deployment status: `supabase functions list`
3. View logs: `supabase functions logs server`
4. Verify environment variables are set

### "Unauthorized" errors

**Cause**: No admin user created or wrong credentials

**Fix**:
1. Use the signup page to create an admin account first
2. Use the correct admin signup code: `FAIZAAN2024ADMIN`
3. Check your email/password are correct

### Applications not showing in admin dashboard

**Cause**: This should not happen anymore!

**Why**: The server now uses `kv.getByPrefix('application:')` to fetch ALL applications directly from the database

**If it still happens**:
1. Check browser console for errors
2. Check Supabase logs: `supabase functions logs server`
3. Verify the Health Check shows green

### Men/Women talent not showing in categories

**Cause**: Data might have old format

**Fix**: 

**AUTOMATIC NORMALIZATION**: The system automatically normalizes old data when fetching. All previous "Men" and "Women" entries will show under the MODEL category.

**MANUAL MIGRATION OPTION**: Use the **"Migrate Old Data"** button in the admin dashboard to permanently update old records:
1. Login to admin dashboard
2. Look for the "Data Migration Tool" card at the top
3. Click "Migrate Old Data" button
4. Wait for migration to complete
5. All old "Men"/"Women" entries will be permanently converted to MODEL/Men and MODEL/Women
6. The migration also rebuilds all category indexes for better performance

After migration or with automatic normalization:
1. Old "Men" will show in MODEL → Men
2. Old "Women" will show in MODEL → Women
3. All applications will be visible in admin dashboard

## Admin Dashboard Features

- ✅ View ALL submitted applications (including old data)
- ✅ Filter by status (pending/approved/rejected)
- ✅ Search by name, email, role, nationality
- ✅ View full application details with images
- ✅ Approve applications (adds to website)
- ✅ Reject applications
- ✅ Delete applications
- ✅ Pagination (25 items per page)
- ✅ Automatic category normalization on-the-fly
- ✅ **NEW: Data Migration Tool** - One-click migration of old categories to new structure
- ✅ Category distribution logging for debugging

## Website Features

- ✅ 6 main categories with subcategories
- ✅ Approved models automatically shown
- ✅ Category filtering
- ✅ Search functionality
- ✅ Favorites system
- ✅ Profile pages
- ✅ Responsive design
- ✅ Backward compatibility with old data

## Technical Details

### Server Endpoints

- `POST /make-server-53cfc738/applications/submit` - Submit new application
- `POST /make-server-53cfc738/admin/signup` - Create admin account
- `GET /make-server-53cfc738/admin/applications` - Get all applications (admin only, with auto-normalization)
- `POST /make-server-53cfc738/admin/applications/:id/approve` - Approve application
- `POST /make-server-53cfc738/admin/applications/:id/reject` - Reject application
- `DELETE /make-server-53cfc738/admin/applications/:id` - Delete application
- `POST /make-server-53cfc738/admin/migrate-data` - **NEW: Migrate old data to new category structure**
- `GET /make-server-53cfc738/models/approved` - Get all approved models (with auto-normalization)
- `GET /make-server-53cfc738/models/approved/:category/:subcategory` - Get models by category
- `GET /make-server-53cfc738/health` - Health check endpoint

### Database Structure (KV Store)

- `application:{id}` - Application data
- `approved_model:{id}` - Approved model data for website
- `applications:pending` - List of pending IDs (backup index)
- `applications:approved` - List of approved IDs (backup index)
- `applications:rejected` - List of rejected IDs (backup index)
- `approved_models:{catalog}:{subcategory}` - Category index (optional, for performance)

### Key Changes Made

1. ✅ Fixed server deployment (using `Deno.serve`)
2. ✅ Fixed URL routing (added `/make-server-53cfc738` prefix)
3. ✅ Updated admin endpoint to use `kv.getByPrefix()` - fetches ALL applications
4. ✅ Updated models endpoint to use `kv.getByPrefix()` - fetches ALL approved models
5. ✅ Added automatic data normalization for backward compatibility
6. ✅ Enhanced normalization to handle all edge cases (Men, Women, Models, role field, etc.)
7. ✅ Added Data Migration Tool UI in admin dashboard
8. ✅ Added comprehensive logging with category distribution tracking
9. ✅ Added Health Check diagnostic tool
10. ✅ All previous "Men" and "Women" registrations will automatically show in MODEL category

## Support

If you continue to have issues:

1. Check the Health Check component on `/admin` page
2. Review the test results it provides
3. Check Supabase function logs
4. Verify environment variables are correct
5. Ensure the edge function is deployed successfully

All previously registered talent will automatically show up in the admin dashboard once the edge function is deployed!