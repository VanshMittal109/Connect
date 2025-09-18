import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const adminRouter = Router();

adminRouter.post('/therapists', async (req, res) => {
  const { name, contact, email, specialization, availability } = req.body ?? {};
  if (!name || !contact || !email) return res.status(400).json({ error: 'name, contact, email required' });
  const { data, error } = await supabaseAdmin
    .from('therapists')
    .insert({ name, contact, email, specialization, availability, user_list: [] })
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ therapist: data });
});

adminRouter.get('/therapists', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('therapists').select('*');
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ therapists: data });
});

adminRouter.post('/therapy-processes', async (req, res) => {
  const { name, type, duration, description } = req.body ?? {};
  if (!name || !duration) return res.status(400).json({ error: 'name and duration required' });
  const { data, error } = await supabaseAdmin
    .from('therapy_processes')
    .insert({ name, type, duration, description })
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ process: data });
});

adminRouter.get('/therapy-processes', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('therapy_processes').select('*');
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ processes: data });
});

adminRouter.post('/assign', async (req, res) => {
  const { patient_id, therapist_id } = req.body ?? {};
  if (!patient_id || !therapist_id) return res.status(400).json({ error: 'patient_id and therapist_id required' });

  const { data: therapist, error: getErr } = await supabaseAdmin
    .from('therapists')
    .select('user_list')
    .eq('therapist_id', therapist_id)
    .single();
  if (getErr) return res.status(400).json({ error: getErr.message });

  const userList: unknown = therapist?.user_list ?? [];
  const arr = Array.isArray(userList) ? userList : [];
  if (!arr.includes(patient_id)) arr.push(patient_id);

  const { error: updErr } = await supabaseAdmin
    .from('therapists')
    .update({ user_list: arr })
    .eq('therapist_id', therapist_id);
  if (updErr) return res.status(400).json({ error: updErr.message });

  return res.json({ success: true, therapist_id, patient_id });
});

export default adminRouter;


