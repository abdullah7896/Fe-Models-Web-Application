import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey, getBaseUrl } from './info';

// Create a singleton Supabase client using direct URL since proxy might break Auth endpoints
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Helper function to make API calls to the server
export const makeServerRequest = async (
  endpoint: string,
  options: RequestInit = {},
  useAuth = false
) => {
  const url = `${getBaseUrl()}/functions/v1/make-server-53cfc738${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  if (useAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server request failed: ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making server request to ${endpoint}:`, error);
    throw error;
  }
};