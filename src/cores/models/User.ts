export interface User {
  id?: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password?: string; // only used during registration
  role?: string; // backend assigns role
  status?: boolean;
}

// For registration response
export interface UserRegisterResponse {
  message: string;
  user: User;
}
export interface UserRegisterDto {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
}
