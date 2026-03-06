'use client';

import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerOrders from '@/components/seller/SellerOrders';

export default function SellerOrdersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex">
        <SellerSidebar activeTab="orders" />
        <main className="flex-1 p-6">
          <SellerOrders />
        </main>
      </div>
    </div>
  );
}
