import Header from '@/components/layout/Header';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDescription from '@/components/product/ProductDescription';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductQA from '@/components/product/ProductQA';

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <a href="/" className="hover:text-[#F97316]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
            <span>/</span>
            <a href="#" className="hover:text-[#F97316]">Tài khoản</a>
            <span>/</span>
            <span className="text-[#F97316]">Máy Xay Sinh Tố Cầm Tay Mini - Dụi hạng Đa năng Comet - Dung Tích 350ml</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Product Gallery */}
          <div className="col-span-5">
            <ProductGallery />
          </div>

          {/* Right: Product Info */}
          <div className="col-span-7">
            <ProductInfo />
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-6">
          <ProductDescription />
        </div>

        {/* Related Products */}
        <div className="mt-6">
          <RelatedProducts />
        </div>

        {/* Q&A Section */}
        <div className="mt-6">
          <ProductQA />
        </div>
      </main>
    </div>
  );
}
