export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface JwtPayload {
  IdUser?: string;
  FirstName?: string;
  LastName?: string;
  Login?: string;
}
