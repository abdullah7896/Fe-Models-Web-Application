# How to Deploy the Updated Edge Function

## The Problem
You're getting a 403 error when trying to deploy through Figma Make, which means you need to deploy the edge function manually through Supabase.

## Option 1: Deploy via Supabase Dashboard (Easiest)

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/pggyqrqgyoehftdmnswa
2. Navigate to **Edge Functions** in the left sidebar

### Step 2: Find Your Function
1. Look for a function called `server` or `make-server` or similar
2. Click on it to open

### Step 3: Update the Code
You need to update three files in your edge function:

#### File 1: `index.ts` or `index.tsx`
Copy the ENTIRE content from `/supabase/functions/server/index.tsx` in this project

#### File 2: `kv_store.ts` or `kv_store.tsx`  
Copy the ENTIRE content from `/supabase/functions/server/kv_store.tsx` in this project

#### File 3: `deno.json`
Copy the content from `/supabase/functions/server/deno.json` in this project

### Step 4: Deploy
Click the **Deploy** button in the Supabase dashboard

---

## Option 2: Deploy via Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref pggyqrqgyoehftdmnswa

# Deploy the function
supabase functions deploy server
```

---

## Option 3: Check if Function Already Exists

The edge function might already be deployed but not responding. Let's check:

### Check Function Status
1. Go to https://supabase.com/dashboard/project/pggyqrqgyoehftdmnswa/functions
2. Look for your function (likely called `server`)
3. Check the **Status** - it should show as "Active"
4. Click on **Logs** to see if there are any errors

### Test the Function
Try accessing this URL directly in your browser:
```
https://pggyqrqgyoehftdmnswa.supabase.co/functions/v1/server/make-server-53cfc738/health
```

You should see: `{"status":"healthy","timestamp":"..."}`

If you see an error, the function needs to be redeployed.

---

## What to Look For After Deployment

### 1. Function is Running
The health check URL should return a 200 OK response

### 2. Check Logs
In Supabase Dashboard → Edge Functions → Your Function → Logs

Look for:
- `==== FETCHING ALL APPLICATIONS FOR ADMIN ====`
- `[KV Store] Found X application records`
- `[Category Distribution]:`

### 3. Admin Dashboard Loads
Refresh your admin dashboard and check if applications appear

---

## Still Having Issues?

If deployment still fails with 403, you may need to:

1. **Check your Supabase plan** - Some plans have restrictions on edge functions
2. **Verify permissions** - Make sure your account has permission to deploy functions
3. **Contact Supabase support** - They can help with permission issues

---

## Alternative: Check Database Directly

While fixing the edge function, you can verify your data exists:

1. Go to https://supabase.com/dashboard/project/pggyqrqgyoehftdmnswa/editor
2. Find the table `kv_store_53cfc738`
3. Look for rows where the `key` column starts with `application:`
4. You should see all your submitted applications there

If the table is empty, that means no applications have been submitted yet.
