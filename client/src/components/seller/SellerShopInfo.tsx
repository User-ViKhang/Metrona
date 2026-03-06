'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalSold: number;
  isActive: boolean;
  createdAt: string;
}

export default function SellerShopInfo() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      const data: any = await api.getMyShop();
      setShop(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
      });
    } catch (error) {
      console.error('Failed to load shop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.updateShop(formData);
      await loadShop();
      setToastMessage('Cập nhật thông tin cửa hàng thành công');
      setToastType('success');
      setShowToast(true);
      setIsEditing(false);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra. Vui lòng thử lại');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-[#94A3B8]">Không tìm thấy thông tin cửa hàng</p>
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Thông Tin Cửa Hàng</h1>
          <p className="text-[#64748B]">Quản lý thông tin và cài đặt cửa hàng</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Tên cửa hàng"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Mô tả cửa hàng
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
                placeholder="Nhập mô tả về cửa hàng của bạn"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E7EB]">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Tên cửa hàng</p>
                <p className="text-[#0F172A] font-medium">{shop.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Trạng thái</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  shop.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {shop.isActive ? 'Đang hoạt động' : 'Tạm ngừng'}
                </span>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Đánh giá</p>
                <p className="text-[#0F172A] font-medium">
                  ⭐ {(shop.rating || 0).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Tổng sản phẩm đã bán</p>
                <p className="text-[#0F172A] font-medium">{shop.totalSold || 0}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#64748B] mb-1">Mô tả</p>
              <p className="text-[#0F172A]">{shop.description || 'Chưa có mô tả'}</p>
            </div>

            <div>
              <p className="text-sm text-[#64748B] mb-1">Ngày tạo</p>
              <p className="text-[#0F172A]">
                {new Date(shop.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
