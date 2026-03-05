'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-[#FFD89B] via-[#FFE4B5] to-[#FFEDD5] rounded-lg overflow-hidden">
      <div className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-[#0F172A] mb-4">
              Tất Cả Trong Tầm Tay
            </h1>
            <p className="text-xl text-[#475569] mb-6">
              Mua Sắm Mọi Thứ Bạn Cần Ngay Tại Một Nơi
            </p>
            
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Ưu đãi giảm đến <span className="font-bold text-[#F97316]">50%</span></span>
              </div>
              <div className="flex items-center gap-2 text-[#0F172A]">
                <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Freeship đơn từ <span className="font-bold text-[#F97316]">99k</span></span>
              </div>
              <div className="flex items-center gap-2 text-[#0F172A]">
                <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sản phẩm chất lượng</span>
              </div>
            </div>

            <button className="px-8 py-3 bg-[#F97316] text-[#FFFFFF] rounded-md font-semibold hover:bg-[#EA580C] transition-colors shadow-lg">
              Mua Ngay
            </button>
          </div>

          <div className="flex-1 relative h-80">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full flex items-center justify-end">
              {/* Placeholder for hero image */}
              <div className="relative">
                <div className="w-64 h-64 bg-[#FFEDD5] rounded-full opacity-50 absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="text-center">
                  <div className="w-48 h-48 bg-[#F97316]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-24 h-24 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
