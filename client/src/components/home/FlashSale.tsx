'use client';

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice: string;
  discount: string;
}

export default function FlashSale() {
  const products: Product[] = [
    { id: 1, name: 'Airpods Pro Gen 2', image: '', price: '299K', originalPrice: '799K', discount: '45%' },
    { id: 2, name: 'Đồng Hồ Thông Minh', image: '', price: '799K', originalPrice: '1.5M', discount: '47%' },
    { id: 3, name: 'Bình Nước Giữ Gần', image: '', price: '409K', originalPrice: '800K', discount: '49%' },
    { id: 4, name: 'Tai Nghe Bluetooth', image: '', price: '39K', originalPrice: '150K', discount: '74%' }
  ];

  return (
    <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-[#FFFFFF]">FLASH SALE</h2>
          <svg className="w-8 h-8 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-[#FFFFFF]">
          <p className="text-sm mb-1">Giảm Đến</p>
          <p className="text-4xl font-bold">50%</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-[#FFFFFF] rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="relative mb-3">
              <div className="aspect-square bg-[#F1F5F9] rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#F97316] font-bold text-lg">{product.price}</span>
              <span className="text-[#94A3B8] text-sm line-through">{product.originalPrice}</span>
            </div>
            <button className="w-full bg-[#F97316] text-[#FFFFFF] py-2 rounded-md text-sm font-medium hover:bg-[#EA580C] transition-colors">
              Mua Ngay
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button className="bg-[#FACC15] text-[#0F172A] px-8 py-3 rounded-md font-bold hover:bg-[#FEF9C3] transition-colors">
          Mua Ngay
        </button>
      </div>
    </div>
  );
}
