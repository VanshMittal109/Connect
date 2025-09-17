const { createClient } = require('Connect/node_modules/@supabase/supabase-js/src');
require('../../Connect/node_modules/dotenv/lib/main').config(); 

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;