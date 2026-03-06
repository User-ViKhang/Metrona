'use client';

import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerOverview from '@/components/seller/SellerOverview';

export default function SellerOverviewPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex">
        <SellerSidebar activeTab="overview" />
        <main className="flex-1 p-6">
          <SellerOverview />
        </main>
      </div>
    </div>
  );
}
