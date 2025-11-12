'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences, LoginCredentials, RegisterCredentials, AuthContextType as AuthTypes } from '@/types/user';

// 将在客户端通过 API 与服务端交互，客户端不得直接使用数据库连接或 bcrypt
interface LocalAuthContext extends Omit<AuthTypes, 'login' | 'register'> {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<LocalAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化 - 从localStorage加载用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('加载用户失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    const { email, password } = credentials;
    try {
      // demo account removed — use real auth endpoint

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!res.ok) {
        // 尝试解析后端返回的 JSON 错误消息，优先使用常见字段（error/message/details），否则回退为纯文本
        try {
          const errJson = await res.json();
          const msg = errJson?.error || errJson?.message || errJson?.details || '登录失败';
          throw new Error(msg);
        } catch (e) {
          const errText = await res.text();
          throw new Error(errText || '登录失败');
        }
      }

      const json = await res.json();
      const userData: User = json.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    const { name, email, password, confirmPassword } = credentials;
    try {
      if (password !== confirmPassword) throw new Error('两次输入的密码不一致');
      if (password.length < 6) throw new Error('密码长度至少为6位');

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      if (!res.ok) {
        // 尝试解析JSON错误详情
        try {
          const errJson = await res.json();
          throw new Error(errJson?.error || errJson?.details || '注册失败');
        } catch (e) {
          const errText = await res.text();
          throw new Error(errText || '注册失败');
        }
      }

      const json = await res.json();
      const newUser: User = json.user;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    if (!user) throw new Error('用户未登录');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || '更新用户信息失败');
      }

      const json = await res.json();
      const updatedUser: User = json.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('更新用户信息失败:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};