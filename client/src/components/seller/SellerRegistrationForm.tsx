'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SellerRegistrationForm() {
  const [activeTab, setActiveTab] = useState<'shop' | 'bank'>('shop');
  const [formData, setFormData] = useState({
    shopName: '',
    businessCategory: '',
    region: '',
    address: '',
    description: '',
    accountHolder: '',
    accountNumber: '',
    bankName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFE4B5] to-[#FFEDD5] rounded-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#F97316] mb-3">
              Đăng Ký Kênh Người Bán
            </h1>
            <p className="text-[#475569] text-lg">
              Gia nhập cộng đồng bán hàng Shoply giúp tăng trưởng<br />
              doanh thu bền vững!
            </p>
          </div>
          <div className="w-64 h-48 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
            <svg className="w-32 h-32 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-[#E5E7EB]">
          <div className="flex">
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${
                activeTab === 'shop'
                  ? 'text-[#F97316]'
                  : 'text-[#475569] hover:text-[#F97316]'
              }`}
            >
              Thông Tin Shop
              {activeTab === 'shop' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${
                activeTab === 'bank'
                  ? 'text-[#F97316]'
                  : 'text-[#475569] hover:text-[#F97316]'
              }`}
            >
              Tài Khoản Ngân Hàng
              {activeTab === 'bank' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />
              )}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {activeTab === 'shop' ? (
            <>
              {/* Shop Info Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F97316] text-[#FFFFFF] rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Thông Tin Shop</h2>
                </div>

                <p className="text-sm text-[#94A3B8] mb-6">
                  Cung cấp thông tin của hàng của bạn. Sau khi xác<br />
                  minh cuyết hồ sơ bạn có thể bắt đầu bán hàng ngay!
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Tên Shop <span className="text-[#EF4444]">*</span>
                    </label>
                    <Input
                      name="shopName"
                      placeholder="Nhập tên shop của bạn (không chứa ký tự đặc biệt, không khoảng trắng đầu"
                      value={formData.shopName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Danh mục kinh doanh
                    </label>
                    <select
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#F97316] text-[#94A3B8]"
                    >
                      <option value="">- Chọn danh mục -</option>
                      <option value="fashion">Thời trang</option>
                      <option value="electronics">Điện tử</option>
                      <option value="home">Đồ gia dụng</option>
                      <option value="beauty">Làm đẹp</option>
                      <option value="food">Thực phẩm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Khu vực
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#F97316] text-[#94A3B8]"
                    >
                      <option value="">- Chọn tỉnh/thành phố -</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Địa chỉ của hàng
                    </label>
                    <Input
                      name="address"
                      placeholder="Số nhà, đường, phường, quận..."
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Giới thiệu ngắn về shop
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#F97316] resize-none"
                        placeholder="Mô tả về shop của bạn..."
                      />
                      <span className="absolute bottom-3 right-3 text-xs text-[#94A3B8]">
                        {formData.description.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bank Info Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F97316] text-[#FFFFFF] rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Tài Khoản Ngân Hàng</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Chủ tài khoản
                    </label>
                    <Input
                      name="accountHolder"
                      placeholder="Nhập tên chủ tài khoản"
                      value={formData.accountHolder}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Số tài khoản
                    </label>
                    <select
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#F97316] text-[#94A3B8]"
                    >
                      <option value="">Nhập số tài khoản</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Ngân hàng
                    </label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#F97316] text-[#94A3B8]"
                    >
                      <option value="">- Chọn ngân hàng -</option>
                      <option value="vietcombank">Vietcombank</option>
                      <option value="techcombank">Techcombank</option>
                      <option value="vcb">VCB</option>
                      <option value="acb">ACB</option>
                      <option value="mbbank">MB Bank</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#E5E7EB]">
            <Button type="submit" variant="primary" className="px-12">
              Đăng KÝ Ngay
            </Button>
            <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#F97316] border-[#E5E7EB] rounded focus:ring-[#F97316]"
              />
              <span>Hiểu và đọ quyết định</span>
            </label>
          </div>

          {/* Terms */}
          <div className="mt-6 text-sm text-[#475569]">
            Bằng việc đăng ký bạn đồng ý với{' '}
            <a href="#" className="text-[#F97316] hover:text-[#EA580C]">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-[#F97316] hover:text-[#EA580C]">
              Chính sách
            </a>{' '}
            của Shoply
          </div>
          <div className="mt-2 text-sm text-[#475569]">
            Đã có tài khoản người bán?{' '}
            <a href="#" className="text-[#F97316] hover:text-[#EA580C] font-medium">
              Đăng nhập ngay
            </a>
          </div>
        </form>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-[#FEF9C3] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">100%</h3>
          <p className="text-sm text-[#475569]">Hàng Chính Hãng</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-[#FFEDD5] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">Miễn Phí Đổi Trả</h3>
          <p className="text-sm text-[#475569]">7 Ngày</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-[#DBEAFE] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">Thanh Toán Khi</h3>
          <p className="text-sm text-[#475569]">Nhận Hàng</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-8 bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center gap-8">
          <img src="/visa.svg" alt="Visa" className="h-8 opacity-60" />
          <img src="/mastercard.svg" alt="Mastercard" className="h-8 opacity-60" />
          <img src="/paypal.svg" alt="PayPal" className="h-8 opacity-60" />
          <span className="text-[#475569] font-medium">COD</span>
          <svg className="w-10 h-10 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#94A3B8]">
          <span>Cổng thanh toán</span>
          <span>Cẩm nẫn</span>
          <span>Phương Vận</span>
          <span>Quảng Lưu</span>
        </div>
        <p className="text-center text-xs text-[#94A3B8] mt-2">
          © 2025 SHOPLY - Platform designed with love
        </p>
      </div>
    </div>
  );
}
