'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function ProfileInfo() {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    language: 'VI' as 'VI' | 'EN'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        language: user.language || 'VI'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await api.updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        language: formData.language
      });
      
      // Refresh user data
      await refreshProfile();
      
      setToastMessage('Cập nhật thông tin thành công!');
      setToastType('success');
      setShowToast(true);
      setErrors({});
    } catch (error: any) {
      setToastMessage(error.message || 'Cập nhật thất bại. Vui lòng thử lại.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        language: user.language || 'VI'
      });
    }
    setErrors({});
  };

  if (!user) {
    return (
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <p className="text-center text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Profile Form */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Thông tin cá nhân</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-[#FEE2E2] border border-[#EF4444] rounded-sm">
              <p className="text-sm text-[#EF4444]">{errors.general}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Họ và tên <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Email <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                disabled={true}
                className="bg-[#F8FAFC] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone & Language */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Số điện thoại
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Ngôn ngữ <span className="text-[#EF4444]">*</span>
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-sm text-sm transition-colors text-[#0F172A] border-[#E5E7EB] focus:border-[#F97316] focus:outline-none focus:ring-0"
              >
                <option value="VI">Tiếng Việt</option>
                <option value="EN">English</option>
              </select>
            </div>
          </div>

          {/* User ID & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                ID Người dùng
              </label>
              <Input
                value={user.id}
                disabled={true}
                className="bg-[#F8FAFC] cursor-not-allowed text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Trạng thái tài khoản
              </label>
              <div className="flex items-center gap-2 px-4 py-3 border border-[#E5E7EB] rounded-sm bg-[#F8FAFC]">
                <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-sm text-[#0F172A]">
                  {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Ngày tạo tài khoản
              </label>
              <Input
                value={new Date(user.createdAt).toLocaleString('vi-VN')}
                disabled={true}
                className="bg-[#F8FAFC] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Cập nhật lần cuối
              </label>
              <Input
                value={user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                disabled={true}
                className="bg-[#F8FAFC] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB]">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Lưu Thông Tin
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Khôi Phục
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
