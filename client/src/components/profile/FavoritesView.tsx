'use client';

export default function FavoritesView() {
  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Sản Phẩm Yêu Thích</h2>
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="text-[#94A3B8]">Chưa có sản phẩm yêu thích</p>
      </div>
    </div>
  );
}
