declare namespace Express {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    phoneNumber?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
  }

  interface Request {
    user?: User;
    session?: any;
  }
}
