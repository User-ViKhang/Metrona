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

      {/* Order Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Orders Section */}
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Đơn Hàng Của Tôi</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#FFEDD5] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-[#475569]">Chờ<br />thanh toán</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#FFEDD5] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p className="text-xs text-[#475569]">Chờ<br />vận chuyển</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#FFEDD5] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p className="text-xs text-[#475569]">Đang<br />giao hàng</p>
            </div>
          </div>

          <button className="w-full mt-6 text-[#F97316] text-sm font-medium hover:text-[#EA580C] flex items-center justify-center gap-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem lịch sử mua hàng
          </button>
        </div>

        {/* Account Activity */}
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Hoạt Động Của Tài Khoản</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#FEE2E2] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-[#475569]">Yêu thích</p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-[#FFEDD5] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-6 bg-[#EF4444] text-[#FFFFFF] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  5
                </span>
              </div>
              <p className="text-xs text-[#475569]">Thông báo</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#FFEDD5] rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <p className="text-xs text-[#475569]">Voucher<br />giảm giá</p>
            </div>
          </div>

          <button className="w-full mt-6 text-[#F97316] text-sm font-medium hover:text-[#EA580C] flex items-center justify-center gap-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem nhật ký của nhóm
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-[#FEF9C3] border border-[#FACC15] rounded-lg p-4 flex items-start gap-3">
        <svg className="w-6 h-6 text-[#FACC15] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h4 className="font-semibold text-[#0F172A] mb-1">Bảo mật tài khoản: Trung bình</h4>
          <p className="text-sm text-[#475569] mb-2">
            Hãy cập nhật đầy đủ các thông tin để đảng cường bảo mật tài khoản
          </p>
          <button className="text-sm text-[#F97316] font-medium hover:text-[#EA580C] cursor-pointer">
            Sổ địa zchl của tôi →
          </button>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Địa Chỉ Của Tôi</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#94A3B8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-[#0F172A]">123 Đường A, Quận B, TP.HCM</p>
                <button className="text-sm text-[#F97316] hover:text-[#EA580C] mt-1 cursor-pointer">
                  Sổ địa chỉ của tôi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Địa Chỉ Của Tôi</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#94A3B8] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-[#0F172A]">Gợi Tiếp tục biếp không có tài khoản</p>
                <button className="text-sm text-[#F97316] hover:text-[#EA580C] mt-1 cursor-pointer">
                  Sổ địa chỉ của tôi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
