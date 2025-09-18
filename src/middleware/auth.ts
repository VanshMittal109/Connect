import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'admin' | 'therapist' | 'patient';
      userEmail?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ error: 'Invalid token' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Unauthorized' });

    req.userId = data.user.id;
    req.userEmail = data.user.email ?? undefined;
    // role resolution from a profile table or JWT claim `role`
    const role = (data.user.user_metadata?.role as string | undefined) ?? 'patient';
    if (role === 'admin' || role === 'therapist' || role === 'patient') {
      req.userRole = role;
    } else {
      req.userRole = 'patient';
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(roles: Array<'admin' | 'therapist' | 'patient'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}


