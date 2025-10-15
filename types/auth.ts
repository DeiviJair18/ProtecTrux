export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  badge?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
}

export enum UserRole {
  CITIZEN = 'citizen',
  POLICE_OFFICER = 'police_officer',
  SECURITY_GUARD = 'security_guard',
  EMERGENCY_RESPONDER = 'emergency_responder',
  ADMIN = 'admin'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}



