'use client';

import Button from '@/components/ui/Button';

export default function CartSummary() {
  return (
    <div className="sticky top-24 space-y-4">
      {/* Order Summary */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">Thông Tin Đơn Hàng</h2>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-sm text-[#0F172A]">Voucher: Giảm 40k</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-[#0F172A]">Freeship đơn từ 59k</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-sm text-[#0F172A]">Miễn phí vận chuyển</span>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4 mb-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Tiết kiệm ngay</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#475569]">Tổng tiền hàng</span>
            <span className="text-sm font-medium text-[#0F172A]">778,000đ</span>
          </div>

          <div className="flex items-center justify-between text-sm text-[#22C55E] mb-2">
            <span>Giảm 40k</span>
            <span>-40,000đ</span>
          </div>

          <div className="flex items-center justify-between text-sm text-[#22C55E] mb-2">
            <span>Freeship đơn từ 59k</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-[#22C55E]">
            <span>Miễn phí vận chuyển</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-semibold text-[#0F172A]">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-[#F97316]">617,000đ</span>
          </div>
          <p className="text-xs text-[#94A3B8] text-right">
            (Đã bao gồm VAT nếu có)
          </p>
        </div>

        <Button variant="primary" fullWidth className="mb-3">
          Mua Hàng (3)
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hàng Bạn chuyển, nhóng tiền chỉ hàng</span>
        </div>
      </div>

      {/* Savings Info */}
      <div className="bg-[#FFEDD5] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-[#0F172A]">Tiết kiệm ngay 161,000đ</span>
        </div>
        <p className="text-xs text-[#475569]">
          Bạn đã tiết kiệm được <span className="font-semibold">161,000đ</span> cho đơn hàng này
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FFFFFF] rounded-lg p-3 text-center shadow-sm">
          <div className="w-10 h-10 bg-[#FEF9C3] rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-[#475569] font-medium">100%<br />Hàng Chính Hãng</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg p-3 text-center shadow-sm">
          <div className="w-10 h-10 bg-[#FFEDD5] rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-xs text-[#475569] font-medium">Miễn Phí Đổi<br />Trả 7 Ngày</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg p-3 text-center shadow-sm">
          <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xs text-[#475569] font-medium">Thanh Toán Khi<br />Nhận Hàng</p>
        </div>
      </div>
    </div>
  );
}
