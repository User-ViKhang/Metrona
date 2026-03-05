import Header from '@/components/layout/Header';
import SellerRegistrationForm from '@/components/seller/SellerRegistrationForm';

export default function SellerRegisterPage() {
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
            <span>Tài khoản</span>
            <span>/</span>
            <span className="text-[#F97316]">Hồ Sơ Bán Hàng Tại Cẩm Tay</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <SellerRegistrationForm />
      </main>
    </div>
  );
}
