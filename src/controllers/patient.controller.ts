import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const patientRouter = Router();

// No daily schedule table in schema; provide latest plan instead
patientRouter.get('/plan', async (req, res) => {
  const userId = req.userId;
  const { data, error } = await supabaseAdmin
    .from('therapy_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ plan: data ?? null });
});

// Appointments
patientRouter.get('/appointments', async (req, res) => {
  const userId = req.userId;
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('user_id', userId);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ appointments: data });
});

// Notifications
patientRouter.get('/notifications', async (req, res) => {
  const userId = req.userId;
  const { data, error } = await supabaseAdmin.from('notifications').select('*').eq('user_id', userId);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ notifications: data });
});

export default patientRouter;


