'use client';

import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerProducts from '@/components/seller/SellerProducts';

export default function SellerProductsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex">
        <SellerSidebar activeTab="products" />
        <main className="flex-1 p-6">
          <SellerProducts />
        </main>
      </div>
    </div>
  );
}
