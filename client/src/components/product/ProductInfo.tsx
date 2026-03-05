'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ProductInfo() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
      {/* Product Title & Store */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
          Máy Xay Sinh Tố Cầm Tay Mini Đa Năng Comet - Dung Tích 350ml
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#F97316] font-bold">4.8</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#94A3B8]">(1k đánh giá)</span>
          </div>
          <span className="text-[#E5E7EB]">|</span>
          <span className="text-sm text-[#475569]">Đã bán: <span className="font-medium">3.5k</span></span>
        </div>
      </div>

      {/* Store Info */}
      <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg mb-6">
        <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center text-[#FFFFFF] font-bold">
          C
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A]">Comet Official Store</span>
            <svg className="w-5 h-5 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-[#94A3B8]">Online gần đây • 2 phút trước</p>
        </div>
        <button className="text-sm text-[#F97316] hover:text-[#EA580C] font-medium flex items-center gap-1">
          Xem hàng Thoát Bắt Gần Bị Trút
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-sm text-[#94A3B8] line-through">Giá gốc</span>
          <span className="text-3xl font-bold text-[#F97316]">259,000đ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#475569]">Gust</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Vouchers */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-medium rounded">
            Voucher Giảm 40k
          </span>
          <span className="px-3 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-medium rounded">
            Mua 2 - 10k
          </span>
          <button className="text-xs text-[#F97316] hover:text-[#EA580C] flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="space-y-3 mb-6 p-4 bg-[#F8FAFC] rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0F172A] mb-1">Miễn phí vận chuyển</p>
            <p className="text-xs text-[#94A3B8]">Tìm hiểu thêm →</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0F172A] mb-1">Địa chỉ Hồ Chí Minh</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0F172A] mb-1">Tiện vận</p>
            <p className="text-xs text-[#94A3B8]">Dự kiến nhận hàng ngày: <span className="font-medium text-[#0F172A]">99K</span></p>
            <p className="text-xs text-[#94A3B8]">Dự kiến đơn = 1 tháng: <span className="text-[#EF4444]">giá 30.000</span></p>
            <p className="text-xs text-[#94A3B8]">Bảo hành: <span className="font-medium text-[#0F172A]">until 23 năm nay</span></p>
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-[#475569]">Số lượng:</span>
        <div className="flex items-center border border-[#E5E7EB] rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
          >
            <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-8 text-center border-x border-[#E5E7EB] focus:outline-none"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
          >
            <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Thêm vào giỏ hàng
        </Button>
        <Button variant="primary" className="flex-1">
          Mua ngay
        </Button>
      </div>

      {/* Additional Info */}
      <button className="w-full text-[#F97316] text-sm font-medium hover:text-[#EA580C] flex items-center justify-center gap-2 py-3 border border-[#F97316] rounded-md">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Thêm vào giỏ toàn
      </button>

      {/* Badges */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="flex items-center gap-2 p-3 bg-[#FFEDD5] rounded-lg">
          <div className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#FFFFFF]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0F172A]">Cần 90% viên gần</p>
            <p className="text-xs text-[#475569]">Cây nổi số hàng thời 100g/ml</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#DCFCE7] rounded-lg">
          <div className="w-10 h-10 bg-[#22C55E] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0F172A]">Vận chuyển đỏ 39%</p>
            <p className="text-xs text-[#475569]">Theo chuyển buộn Hải Phòng →</p>
          </div>
        </div>
      </div>

      {/* More Info Badges */}
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 p-3 bg-[#DBEAFE] rounded-lg">
          <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#0F172A]">Giáo vỡng đoàn tại nước</p>
            <p className="text-xs text-[#475569]">Hàng chuyển chuyển gửi hàng</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] rounded-lg">
          <div className="w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#0F172A]">Bảo hành - 12 tháng</p>
            <p className="text-xs text-[#475569]">Tiện huyện tỏ tại hỗi nhận đây</p>
          </div>
        </div>
      </div>
    </div>
  );
}
