import dotenv from 'dotenv';

// Load from project root .env first; if missing, try config/.env
dotenv.config();
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: 'config/.env' });
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  supabaseUrl: process.env.SUPABASE_URL ?? 'https://plemvcnzenuxxpnxopbu.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZW12Y256ZW51eHhwbnhvcGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDI3OTEsImV4cCI6MjA3MzUxODc5MX0.OdQslNyy8B0bXcF5_XE7kQD1zYJ4XnqjUDG4Z4Pz8V4',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZW12Y256ZW51eHhwbnhvcGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0Mjc5MSwiZXhwIjoyMDczNTE4NzkxfQ.Hz7YfzWIWAWdiFfGll58o0mrmqDle0omkdAtzIH4zy4',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
};

export function assertEnv(): void {
  const missing: string[] = []
  if (!env.supabaseUrl) missing.push('SUPABASE_URL')
  if (!env.supabaseAnonKey) missing.push('SUPABASE_ANON_KEY')
  if (!env.supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(`Missing required env vars: ${missing.join(', ')}. Some features may not work until set.`)
  }
}


