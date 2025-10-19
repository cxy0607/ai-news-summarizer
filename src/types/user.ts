// src/types/user.ts
export interface UserPreferences {
  darkMode: boolean;
  subscriptions: string[]; // 订阅的分类列表
}

export interface Subscription {
  category: string;
  enabled: boolean;
}