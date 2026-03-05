'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          phone: formData.phoneNumber || undefined,
        });
      }
      onClose();
      // Reset form
      setFormData({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: ''
      });
    } catch (error: any) {
      setErrors({ general: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-medium text-[#0F172A] mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <p className="text-sm text-[#94A3B8]">
            {mode === 'login' 
              ? 'Chào mừng bạn quay trở lại!' 
              : 'Tạo tài khoản mới để bắt đầu mua sắm'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              name="fullName"
              type="text"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
          )}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          {mode === 'register' && (
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Số điện thoại (không bắt buộc)"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
          )}

          <Input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {errors.general && (
            <div className="p-3 bg-[#FEE2E2] border border-[#EF4444] rounded-sm">
              <p className="text-sm text-[#EF4444]">{errors.general}</p>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#F97316] border-[#E5E7EB] rounded focus:ring-[#F97316]" />
                <span className="text-[#475569]">Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-[#F97316] hover:text-[#EA580C]">
                Quên mật khẩu?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#FFFFFF] text-[#94A3B8]">HOẶC</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E5E7EB] rounded-sm hover:bg-[#F8FAFC] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-[#475569]">Đăng nhập với Google</span>
          </button>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E5E7EB] rounded-sm hover:bg-[#F8FAFC] transition-colors">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium text-[#475569]">Đăng nhập với Facebook</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-sm">
          <span className="text-[#475569]">
            {mode === 'login' ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
          </span>
          {' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[#F97316] hover:text-[#EA580C] font-medium"
          >
            {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </div>

        {/* Terms */}
        {mode === 'register' && (
          <p className="text-xs text-[#94A3B8] text-center">
            Bằng việc đăng ký, bạn đã đồng ý với Metrona về{' '}
            <a href="#" className="text-[#F97316] hover:text-[#EA580C]">Điều khoản dịch vụ</a>
            {' & '}
            <a href="#" className="text-[#F97316] hover:text-[#EA580C]">Chính sách bảo mật</a>
          </p>
        )}
      </div>
    </Modal>
  );
}
