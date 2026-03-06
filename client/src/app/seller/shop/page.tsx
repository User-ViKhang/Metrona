'use client';

import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerShopInfo from '@/components/seller/SellerShopInfo';

export default function SellerShopPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex">
        <SellerSidebar activeTab="shop" />
        <main className="flex-1 p-6">
          <SellerShopInfo />
        </main>
      </div>
    </div>
  );
}
