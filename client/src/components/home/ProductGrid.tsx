'use client';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  sold: string;
  discount: string;
}

export default function ProductGrid() {
  const categories = [
    'Gợi Ý Cho Bạn',
    'Bán Chạy',
    'Giảm Sốc',
    'Hàng Mới',
    'Khám Phá'
  ];

  const products: Product[] = [
    { id: 1, name: 'Máy Hút Bụi Cầm Tay Mini', price: '179K', originalPrice: '350K', rating: 4.5, sold: '2.5k', discount: '45%' },
    { id: 2, name: 'Tai Nghe Bluetooth Không Dây', price: '329K', originalPrice: '600K', rating: 4.8, sold: '1.8k', discount: '45%' },
    { id: 3, name: 'Đồng Hồ Thông Minh Chống Nước', price: '499K', originalPrice: '1.2M', rating: 4.7, sold: '3.2k', discount: '58%' },
    { id: 4, name: 'Kính Mát Thời Trang Cao Cấp', price: '179K', originalPrice: '400K', rating: 4.6, sold: '1.5k', discount: '55%' },
    { id: 5, name: 'Quạt Để Bàn Mini USB', price: '89K', originalPrice: '200K', rating: 4.4, sold: '5.1k', discount: '55%' },
    { id: 6, name: 'Máy Hút Bụi Cầm Tay Mini', price: '179K', originalPrice: '350K', rating: 4.5, sold: '2.5k', discount: '49%' },
    { id: 7, name: 'Tai Nghe Bluetooth Không Dây', price: '329K', originalPrice: '600K', rating: 4.8, sold: '1.8k', discount: '39%' },
    { id: 8, name: 'Đồng Hồ Thông Minh Chống Nước', price: '499K', originalPrice: '1.2M', rating: 4.7, sold: '3.2k', discount: '45%' }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0F172A]">Sản Phẩm Nổi Bật</h2>
        <div className="flex items-center gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`text-sm font-medium transition-colors ${
                index === 0
                  ? 'text-[#F97316] border-b-2 border-[#F97316] pb-1'
                  : 'text-[#475569] hover:text-[#F97316]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button className="text-[#F97316] text-sm font-medium hover:text-[#EA580C] flex items-center gap-1">
          Xem Tất Cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="relative mb-3">
              <div className="aspect-square bg-[#F1F5F9] rounded-lg flex items-center justify-center group-hover:bg-[#E5E7EB] transition-colors">
                <svg className="w-20 h-20 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="absolute top-2 left-2 bg-[#FACC15] text-[#0F172A] text-xs font-bold px-2 py-1 rounded">
                {product.discount}
              </span>
            </div>
            
            <h3 className="text-sm text-[#0F172A] mb-2 line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#F97316] font-bold text-lg">{product.price}</span>
              {product.originalPrice && (
                <span className="text-[#94A3B8] text-xs line-through">{product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#FACC15]' : 'text-[#E5E7EB]'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span>Đã bán {product.sold}</span>
            </div>

            <button className="w-full mt-3 bg-[#F97316] text-[#FFFFFF] py-2 rounded-md text-sm font-medium hover:bg-[#EA580C] transition-colors opacity-0 group-hover:opacity-100">
              Mua Ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
