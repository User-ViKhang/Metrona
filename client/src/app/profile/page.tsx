'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileInfo from '@/components/profile/ProfileInfo';
import OrdersView from '@/components/profile/OrdersView';
import NotificationsView from '@/components/profile/NotificationsView';
import FavoritesView from '@/components/profile/FavoritesView';
import AddressList from '@/components/profile/AddressList';

export default function ProfilePage() {
  const [activeView, setActiveView] = useState('profile');

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileInfo />;
      case 'orders':
        return <OrdersView />;
      case 'notifications':
        return <NotificationsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'addresses':
        return <AddressList />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-[116px] z-30">
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
              <span className="text-[#F97316]">
                {activeView === 'profile' && 'Hồ Sơ Của Tôi'}
                {activeView === 'orders' && 'Đơn Mua'}
                {activeView === 'notifications' && 'Thông Báo'}
                {activeView === 'favorites' && 'Yêu Thích'}
                {activeView === 'addresses' && 'Địa Chỉ'}
              </span>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
              <ProfileSidebar activeView={activeView} onViewChange={setActiveView} />
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
