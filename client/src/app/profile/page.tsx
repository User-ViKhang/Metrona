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
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const [activeView, setActiveView] = useState('profile');
  const [avatarError, setAvatarError] = useState(false);
  const { user } = useAuth();

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
            <div className="col-span-3 space-y-4">
              {/* Avatar Section */}
              {user && (
                <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center overflow-hidden text-[#FFFFFF]">
                        {user.avatar && !avatarError ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#F97316] text-[#FFFFFF] rounded-full flex items-center justify-center hover:bg-[#EA580C] transition-colors cursor-pointer shadow-lg border-2 border-[#FFFFFF]"
                        title="Chỉnh sửa ảnh đại diện"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2 text-center">{user.name}</h3>
                    <span className={`${
                      user.role === 'SELLER' ? 'bg-[#F97316]' : 
                      user.role === 'ADMIN' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'
                    } text-[#FFFFFF] text-xs px-3 py-1 rounded-full`}>
                      {user.role === 'SELLER' ? 'Nhà bán hàng' : 
                       user.role === 'ADMIN' ? 'Quản trị viên' : 'Người mua hàng'}
                    </span>
                  </div>
                </div>
              )}
              
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
