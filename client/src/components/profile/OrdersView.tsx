'use client';

export default function OrdersView() {
  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Đơn Mua</h2>
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-[#94A3B8]">Chưa có đơn hàng nào</p>
      </div>
    </div>
  );
}
