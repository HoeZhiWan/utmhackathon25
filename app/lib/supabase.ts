import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oqvstopoxaecswshyavg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a custom fetch with timeout
const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit = {}, timeout = 20000): Promise<Response> => {
  return new Promise((resolve, reject) => {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // Add the signal to options
    const fetchOptions = {
      ...options,
      signal: controller.signal,
    };

    fetch(url, fetchOptions)
      .then(response => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          // Create a custom error for timeouts
          const timeoutError = new Error('Request timed out');
          timeoutError.name = 'TimeoutError';
          reject(timeoutError);
        } else {
          reject(error);
        }
      });
  });
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: fetchWithTimeout
  }
});

// Add error handling helper for Supabase queries
export const handleSupabaseError = (error: any) => {
  if (error.code === '57014') {
    console.error('Supabase query timeout error:', error);
    throw new Error('Database query timed out. Please try with a smaller date range or fewer records.');
  } else {
    console.error('Supabase error:', error);
    throw new Error(`Database error: ${error.message || 'Unknown error'}`);
  }
};