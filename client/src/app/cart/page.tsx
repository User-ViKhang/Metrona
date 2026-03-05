'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import RelatedProducts from '@/components/product/RelatedProducts';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />

        <main className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Giỏ hàng của bạn</h1>

          {/* Cart Info Bar */}
          <div className="bg-[#FFEDD5] border border-[#F97316] rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm text-[#0F172A]">
                <span className="font-semibold">3 sản phẩm</span> - Hồ Chí Minh
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[#0F172A]">Freeship cho đơn từ 59K</span>
              </div>
              <span className="text-sm font-semibold text-[#F97316]">Tiết kiệm 161,000đ</span>
            </div>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-[#FFEDD5] rounded-lg p-4 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-sm text-[#0F172A]">
              Đơn hàng của bạn đủ điều kiện freeship toàn quốc
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Cart Items */}
            <div className="col-span-8">
              <CartItems />
            </div>

            {/* Cart Summary */}
            <div className="col-span-4">
              <CartSummary />
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-8">
            <RelatedProducts />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
