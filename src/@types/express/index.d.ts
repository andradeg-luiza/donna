declare namespace Express {
  export interface User {
    sub: string;
    email: string;
  }

  export interface Request {
    user: User;
  }
}
