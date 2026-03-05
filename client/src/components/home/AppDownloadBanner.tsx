'use client';

export default function AppDownloadBanner() {
  return (
    <div className="bg-gradient-to-r from-[#FFE4B5] to-[#FFEDD5] rounded-lg overflow-hidden">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="w-32 h-32 bg-[#F97316]/20 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
              Mua Sắm Thả Ga - Nhận Ngay Ưu Đãi!
            </h2>
            <p className="text-[#475569] mb-6">
              Đăng ký là cắc mở giảm giá HOT, coupon miễn phí và<br />
              nhiều ưu đãi độc quyền khác
            </p>
            <button className="px-8 py-3 bg-[#F97316] text-[#FFFFFF] rounded-md font-semibold hover:bg-[#EA580C] transition-colors">
              Tải Ứng Dụng Ngay!
            </button>
          </div>

          <div className="flex-1 flex justify-end gap-3">
            <div className="bg-[#0F172A] text-[#FFFFFF] px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#475569] transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </div>

            <div className="bg-[#0F172A] text-[#FFFFFF] px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#475569] transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
