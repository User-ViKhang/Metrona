'use client';

import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerCategories from '@/components/seller/SellerCategories';

export default function SellerCategoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex">
        <SellerSidebar activeTab="categories" />
        <main className="flex-1 p-6">
          <SellerCategories />
        </main>
      </div>
    </div>
  );
}
