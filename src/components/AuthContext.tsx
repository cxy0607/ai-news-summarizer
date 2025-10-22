'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取用户数据库
  const getUsersDatabase = (): User[] => {
    try {
      const users = localStorage.getItem('users_database');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users database:', error);
      return [];
    }
  };

  // 保存用户数据库
  const saveUsersDatabase = (users: User[]) => {
    try {
      localStorage.setItem('users_database', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users database:', error);
    }
  };

  // 检查本地存储中的用户信息
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 检查演示账户
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          preferences: {
            darkMode: false,
            subscriptions: ['technology', 'business']
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return;
      }

      // 从用户数据库中查找用户
      const users = getUsersDatabase();
      const foundUser = users.find(u => u.email === credentials.email);
      
      if (foundUser) {
        // 注意：在实际应用中，这里应该验证密码哈希
        // 这里为了演示，我们假设密码验证通过
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('用户不存在，请先注册');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的验证
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // 检查邮箱是否已存在
      const users = getUsersDatabase();
      const existingUser = users.find(u => u.email === credentials.email);
      
      if (existingUser) {
        throw new Error('该邮箱已被注册，请使用其他邮箱或直接登录');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        preferences: {
          darkMode: false,
          subscriptions: []
        }
      };
      
      // 将新用户添加到用户数据库
      const updatedUsers = [...users, newUser];
      saveUsersDatabase(updatedUsers);
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
