export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  FirstName?: string;
  Login?: string;
}
