export interface UserProfile {
  id: number;
  email: string;
  username: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  skillLevel: string;
  provider: 'LOCAL' | 'GOOGLE';
  messageCount: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}
