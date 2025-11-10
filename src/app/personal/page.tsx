"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { NewsItem } from '@/types/news';

type ChangePasswordProps = {
  onSubmit: (current: string, next: string, confirm: string) => Promise<void> | void;
  loading: boolean;
  error: string;
};

const ChangePasswordForm: React.FC<ChangePasswordProps> = ({ onSubmit, loading, error }) => {
  const [current, setCurrent] = useState('');
  const [nextPwd, setNextPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(current, nextPwd, confirm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-300 mb-1">当前密码</label>
        <input aria-label="当前密码" placeholder="当前密码" type="password" value={current} onChange={e => setCurrent(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5" />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">新密码</label>
        <input aria-label="新密码" placeholder="新密码" type="password" value={nextPwd} onChange={e => setNextPwd(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5" />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">确认新密码</label>
        <input aria-label="确认新密码" placeholder="确认新密码" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-cyan-500 text-white rounded">{loading ? '处理中...' : '修改密码'}</button>
      </div>
    </form>
  );
};

export default function PersonalPage() {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [history, setHistory] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'profile'|'subscriptions'|'favorites'|'history'|'settings'>('profile');
  const categories = ['科技', '环境', '汽车', '健康', '娱乐', '体育', '财经'];
  const [subscriptions, setSubscriptions] = useState<string[]>(user?.preferences?.subscriptions ?? []);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 加载用户数据
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // 从后端 API 加载收藏和历史（服务端从 session/user 中识别当前用户）
        const favRes = await fetch('/api/favorites', { credentials: 'include' });
        if (favRes.ok) {
          const favJson = await favRes.json();
          const favs = Array.isArray(favJson) ? favJson.map((r: any) => r.newsData || r) : [];
          setFavorites(favs);
        }

        const histRes = await fetch('/api/history', { credentials: 'include' });
        if (histRes.ok) {
          const histJson = await histRes.json();
          const hist = Array.isArray(histJson) ? histJson.map((r: any) => r.newsData || r) : [];
          setHistory(hist);
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
      }
    };

    loadUserData();
  }, [user]);

  // 处理编辑名称
  const handleEditName = async () => {
    if (!user) return;

    if (isEditing) {
      // 保存名称
      if (editName.trim() && editName !== user.name) {
        try {
          await updateUser({ name: editName.trim() });
        } catch (error) {
          console.error('更新名称失败:', error);
        }
      }
      setIsEditing(false);
    } else {
      setEditName(user.name || '');
      setIsEditing(true);
    }
  };

  // 头像上传处理（简易：读取为 DataURL 并更新用户）
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // 如果处于编辑模式，则先只预览，保存时再提交
        setAvatarPreview(dataUrl);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('读取文件失败', err);
    }
  };

  // 取消收藏
  const removeFavorite = async (newsId: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('删除失败');
      setFavorites(prev => prev.filter(n => n.id !== newsId));
    } catch (err) {
      console.error('删除收藏失败', err);
    }
  };

  // 取消收藏
  const handleStartEdit = () => {
    if (!user) return;
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setAvatarPreview(user.avatar || null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
    setEditEmail('');
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const payload: any = {};
      if (editName.trim() && editName !== user.name) payload.name = editName.trim();
      if (editEmail.trim() && editEmail !== user.email) payload.email = editEmail.trim();
      if (avatarPreview) payload.avatar = avatarPreview; // dataURL from preview

      if (Object.keys(payload).length > 0) {
        await updateUser(payload);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('保存资料失败', err);
    } finally {
      setSavingProfile(false);
    }
  };
  // 清空历史
  const clearHistory = async () => {
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('清空失败');
      setHistory([]);
    } catch (err) {
      console.error('清空历史失败', err);
    }
  };

  // 订阅开关
  const toggleSubscription = async (cat: string) => {
    const next = subscriptions.includes(cat) ? subscriptions.filter(s => s !== cat) : [...subscriptions, cat];
    setSubscriptions(next);
    try {
      // Ensure preferences object has required fields (darkMode and subscriptions)
      const prevPrefs = user?.preferences ?? { darkMode: false, subscriptions: [] };
      const newPrefs = { ...prevPrefs, subscriptions: next };
      await updateUser({ preferences: newPrefs });
    } catch (err) {
      console.error('更新订阅失败', err);
    }
  };

  // 修改密码（前端对接示例）
  const changePassword = async (currentPwd: string, newPwd: string, confirmPwd: string) => {
    setPasswordError('');
    if (newPwd !== confirmPwd) {
      setPasswordError('两次输入的新密码不一致');
      return;
    }
    if (newPwd.length < 6) {
      setPasswordError('新密码至少6位');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
        credentials: 'include'
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || '修改失败');
      }
      // 成功反馈
      setPasswordError('密码修改成功');
    } catch (err: any) {
      setPasswordError(err?.message || '修改失败');
    } finally {
      setPasswordLoading(false);
    }
  };

  // 导出用户数据（favorites/history/user）
  const exportData = () => {
    const payload = { user, favorites, history };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-news-export-${user?.id || 'me'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
          <Home className="w-5 h-5" />
          返回首页
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">个人中心</h1>

      {/* 选项卡 */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          ['profile','个人信息'],
          ['subscriptions','订阅管理'],
          ['favorites','我的收藏'],
          ['history','阅读历史'],
          ['settings','设置']
        ].map(([key,label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-3 py-2 rounded-md text-sm ${activeTab === key ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-200 hover:bg-white/10'}`}
          >{label}</button>
        ))}
      </div>
      
      {/* 选项卡内容 */}
      <div>
        {activeTab === 'profile' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">基本信息</h2>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex gap-4 items-start w-full">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="头像预览" className="w-full h-full object-cover" />
                    ) : user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-3">
                      <input aria-label="编辑姓名" placeholder="姓名" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5" />
                      <input aria-label="编辑邮箱" placeholder="邮箱" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5" />
                      <div className="flex items-center gap-3">
                        <label htmlFor="avatar-upload" className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded cursor-pointer text-sm">更换头像</label>
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} aria-label="上传头像" />
                        <div className="ml-auto flex gap-2">
                          <button onClick={handleSaveProfile} disabled={savingProfile} className="px-4 py-2 bg-cyan-500 text-white rounded">{savingProfile ? '保存中...' : '保存'}</button>
                          <button onClick={handleCancelEdit} className="px-4 py-2 bg-white/5 rounded">取消</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-2xl">{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium">{user.name}</h3>
                          <button onClick={handleStartEdit} className="text-cyan-400 text-sm">编辑</button>
                        </div>
                        <p className="text-gray-400">{user.email}</p>
                        <p className="text-gray-500 text-sm">注册时间: {new Date(user.joinDate || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">订阅管理</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleSubscription(cat)}
                  className={`px-3 py-2 rounded-md text-sm ${subscriptions.includes(cat) ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-200'}`}
                >{cat}</button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">我的收藏 ({favorites.length})</h2>
            <div>
              {favorites.length === 0 ? (
                <p className="text-gray-500">暂无收藏</p>
              ) : (
                <ul className="space-y-3">
                  {favorites.map(n => (
                    <li key={n.id} className="flex items-center justify-between border-b border-gray-700 pb-3">
                      <a href={`/news/${n.id}`} className="hover:text-cyan-400">{n.title}</a>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFavorite(n.id)} className="text-sm text-red-400">移除</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">阅读历史 ({history.length})</h2>
              <div className="flex items-center gap-2">
                <button onClick={clearHistory} className="px-3 py-2 bg-white/5 rounded text-sm">清空历史</button>
                <button onClick={exportData} className="px-3 py-2 bg-white/5 rounded text-sm">导出数据</button>
              </div>
            </div>
            <div>
              {history.length === 0 ? (
                <p className="text-gray-500">暂无历史记录</p>
              ) : (
                <ul className="space-y-3">
                  {history.map(n => (
                    <li key={n.id} className="border-b border-gray-700 pb-3">
                      <a href={`/news/${n.id}`} className="hover:text-cyan-400">{n.title}</a>
                      <p className="text-gray-500 text-sm">{n.publishTime}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">账号设置</h2>
            <div className="max-w-md">
              <ChangePasswordForm onSubmit={changePassword} loading={passwordLoading} error={passwordError} />
            </div>
          </div>
        )}
      </div>

      {/* 收藏和历史记录 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">我的收藏 ({favorites.length})</h2>
          <div className="bg-gray-800 rounded-xl p-4">
            {favorites.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无收藏内容</p>
            ) : (
              <ul className="space-y-3">
                {favorites.slice(0, 5).map((news) => (
                  <li key={news.id} className="border-b border-gray-700 pb-3">
                    <a href={`/news/${news.id}`} className="hover:text-cyan-400">{news.title}</a>
                    <p className="text-gray-500 text-sm">{news.publishTime}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">阅读历史 ({history.length})</h2>
          <div className="bg-gray-800 rounded-xl p-4">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无阅读历史</p>
            ) : (
              <ul className="space-y-3">
                {history.slice(0, 5).map((news) => (
                  <li key={news.id} className="border-b border-gray-700 pb-3">
                    <a href={`/news/${news.id}`} className="hover:text-cyan-400">{news.title}</a>
                    <p className="text-gray-500 text-sm">{news.publishTime}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}