import { Request, Response, NextFunction } from 'express';
import { auth } from '../../lib/auth';
import { adminAuth } from '../../lib/auth-admin';

// Some routes (e.g. GET /api/orders) are hit by both the store, with a
// store-auth session, and the admin panel, with a separate admin-auth
// session/cookie (see lib/auth.ts vs lib/auth-admin.ts). Both cookies can be
// present at once (a staff member browsing the store while also signed into
// the dashboard), so we can't just try one instance then fall back to the
// other — that would silently prefer whichever was checked first regardless
// of which app actually made the request. Use the request's Origin (always
// sent on these cross-origin credentialed calls) to pick the matching
// instance first, and only fall back to the other as a last resort.
const isAdminOrigin = (origin: string) => /:3001$|^https:\/\/admin\./.test(origin);

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const origin = req.headers.origin || '';
    const [primary, secondary] = isAdminOrigin(origin) ? [adminAuth, auth] : [auth, adminAuth];

    const session =
      (await primary.api.getSession({ headers: req.headers })) ??
      (await secondary.api.getSession({ headers: req.headers }));

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
