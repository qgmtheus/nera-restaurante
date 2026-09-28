import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './env.js';

export const db = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'nera' } });
