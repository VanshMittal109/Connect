import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const therapistRouter = Router();

// List assigned patients using therapists.user_list JSON array of patient_ids
therapistRouter.get('/patients', async (req, res) => {
  const therapistEmail = req.userEmail;
  // Find therapist by email
  const { data: therapist, error: tErr } = await supabaseAdmin
    .from('therapists')
    .select('therapist_id, user_list')
    .eq('email', therapistEmail)
    .single();
  if (tErr) return res.status(400).json({ error: tErr.message });

  const ids: unknown = therapist?.user_list ?? [];
  const patientIds: string[] = Array.isArray(ids) ? (ids as string[]) : [];
  if (patientIds.length === 0) return res.json({ patients: [] });

  const { data, error } = await supabaseAdmin
    .from('patients')
    .select('*')
    .in('patient_id', patientIds);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ patients: data });
});

// Create therapy plan for a patient (matching schema)
therapistRouter.post('/plans', async (req, res) => {
  const { user_id, start_date, end_date, status = 'Active', plan_name, description } = req.body ?? {};
  if (!user_id || !start_date || !end_date || !plan_name) {
    return res.status(400).json({ error: 'user_id, start_date, end_date, plan_name required' });
  }
  const { data, error } = await supabaseAdmin
    .from('therapy_plans')
    .insert({ user_id, start_date, end_date, status, plan_name, description })
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ plan: data });
});

// Note: Your schema doesn't include a daily schedule table; skipping generation.

export default therapistRouter;


