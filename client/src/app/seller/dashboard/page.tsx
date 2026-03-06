'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page by default
    router.replace('/seller/products');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <p className="text-[#94A3B8]">Đang chuyển hướng...</p>
    </div>
  );
}
