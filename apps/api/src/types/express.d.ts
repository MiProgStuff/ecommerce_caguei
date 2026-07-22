import { auth } from '../../lib/auth';

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
type SessionUser = NonNullable<SessionResult>['user'];
type SessionData = NonNullable<SessionResult>['session'];

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: SessionData;
    }
  }
}
