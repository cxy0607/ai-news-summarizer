// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarFile?: File;
  preferences: UserPreferences;
  joinDate?: string;
  lastLogin?: string;
}

export interface UserPreferences {
  darkMode: boolean;
  subscriptions: string[]; // 订阅的分类列表
}

export interface Subscription {
  category: string;
  enabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// src/types/user.ts
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>; // 新增 updateUser 方法定义
}