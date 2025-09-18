import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const sanitize = (value: string): string => value.trim().replace(/;$/, '');

const supabaseUrl = sanitize(env.supabaseUrl);
const supabaseAnonKey = sanitize(env.supabaseAnonKey);
const supabaseServiceRoleKey = sanitize(env.supabaseServiceRoleKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
  },
});

// Service client for server-side privileged operations (row level security must allow service role)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


