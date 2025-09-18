import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import adminRouter from '../controllers/admin.controller';
import therapistRouter from '../controllers/therapist.controller';
import patientRouter from '../controllers/patient.controller';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.post('/auth/signup', async (req, res) => {
  const { email, password, role } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: role ?? 'patient' } },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user });
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ session: data.session, user: data.user });
});

router.post('/auth/logout', requireAuth, async (_req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
});

router.use('/admin', requireAuth, requireRole(['admin']), adminRouter);
router.use('/therapist', requireAuth, requireRole(['therapist']), therapistRouter);
router.use('/patient', requireAuth, requireRole(['patient']), patientRouter);

export default router;


