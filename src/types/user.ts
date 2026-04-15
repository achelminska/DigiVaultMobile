export interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    balance: number;
    totalWithdrawn: number;
    warningsCount: number;
  }
  
  export interface UpdateNameRequest {
    idUser: number;
    firstName: string;
    lastName: string;
  }
  
  export interface UpdateEmailRequest {
    idUser: number;
    email: string;
    password: string;
  }
  
  export interface UpdatePasswordRequest {
    idUser: number;
    password: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }