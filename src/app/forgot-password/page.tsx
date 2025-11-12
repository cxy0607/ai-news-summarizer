"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// 步骤枚举
type Step = "input-email" | "verify-code" | "reset-password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input-email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState(""); // 验证通过后存储的token

  // 表单输入变更处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // 输入时清空提示信息
  };

  // 第一步：发送验证码
  const handleSendCode = async () => {
    if (!formData.email) {
      setMessage("请输入邮箱地址");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        '/api/auth/forgot-password/send-code',
        { email: formData.email }
      );
      setMessage(response.data.message);
      setStep('verify-code'); // 跳转到验证步骤
    } catch (error: any) {
      setMessage(error.response?.data?.message || '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  // 第二步：验证验证码
  const handleVerifyCode = async () => {
    if (!formData.code) {
      setMessage('请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        data?: { token?: string };
      }>('/api/auth/forgot-password/verify-code', {
        email: formData.email,
        code: formData.code,
      });
      setMessage(response.data.message);
      setToken(response.data.data?.token || ''); // 存储token
      setStep('reset-password'); // 跳转到重置密码步骤
    } catch (error: any) {
      setMessage(error.response?.data?.message || '验证验证码失败');
    } finally {
      setLoading(false);
    }
  };

  // 第三步：重置密码
  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password/reset', {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setMessage('密码重置成功，正在跳转到登录页...');
      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || '重置密码失败');
    } finally {
      setLoading(false);
    }
  };

  // 返回上一步
  const handleGoBack = () => {
    if (step === 'verify-code') {
      setStep('input-email');
    } else if (step === 'reset-password') {
      setStep('verify-code');
    }
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 'input-email' ? '忘记密码' : step === 'verify-code' ? '验证邮箱' : '重置密码'}
        </h2>

        {/* 提示信息 */}
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('成功') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* 第一步：输入邮箱 */}
        {step === 'input-email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入注册时的邮箱"
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? '发送中...' : '发送验证码'}
            </button>
            <div className="text-center mt-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="text-blue-500 hover:underline text-sm"
              >
                想起密码了？返回登录
              </button>
            </div>
          </div>
        )}

        {/* 第二步：验证验证码 */}
        {step === 'verify-code' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="code">
                验证码
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入邮箱收到的6位验证码"
                maxLength={6}
              />
              <p className="text-gray-500 text-sm mt-1">
                验证码已发送至 {formData.email}，15分钟内有效
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                返回
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {loading ? '验证中...' : '验证'}
              </button>
            </div>
          </div>
        )}

        {/* 第三步：重置密码 */}
        {step === 'reset-password' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                新密码
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入新密码（8位以上，包含字母和数字）"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                确认新密码
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请再次输入新密码"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                返回
              </button>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {loading ? '重置中...' : '确认重置'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
