'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('buyer');
  const [avatarError, setAvatarError] = useState(false);
  const [menuAvatarError, setMenuAvatarError] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'buyer' ? 'seller' : 'buyer';
    setViewMode(newMode);
    // TODO: Navigate to seller dashboard or buyer view
    if (newMode === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/');
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    
    // Nếu chưa đăng nhập hoặc không có role, hiển thị "Khách vãng lai"
    if (!isAuthenticated) {
      return (
        <span className="bg-[#94A3B8] text-[#FFFFFF] text-xs px-2 py-0.5 rounded-full">
          Khách vãng lai
        </span>
      );
    }
    
    const badges = {
      USER: { text: 'Người mua hàng', color: 'bg-[#2563EB]' },
      SELLER: { text: 'Nhà bán hàng', color: 'bg-[#F97316]' },
      ADMIN: { text: 'Quản trị viên', color: 'bg-[#EF4444]' }
    };

    const badge = badges[user.role];
    
    return (
      <span className={`${badge.color} text-[#FFFFFF] text-xs px-2 py-0.5 rounded-full`}>
        {badge.text}
      </span>
    );
  };

  return (
    <>
      <header className="bg-[#FFFFFF] shadow-sm sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-9 text-xs text-[#FFFFFF]">
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-[#FFEDD5] transition-colors">Kênh Người Bán</a>
                <span className="text-[#FFEDD5]/70">|</span>
                <a href="#" className="hover:text-[#FFEDD5] transition-colors">Trở thành Người bán</a>
                <span className="text-[#FFEDD5]/70">|</span>
                <a href="#" className="hover:text-[#FFEDD5] transition-colors flex items-center gap-1">
                  Tải ứng dụng
                </a>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-[#FFEDD5] transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Thông báo
                </a>
                <a href="#" className="hover:text-[#FFEDD5] transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hỗ trợ
                </a>
                <a href="#" className="hover:text-[#FFEDD5] transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tiếng Việt
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-[#F97316] rounded-sm flex items-center justify-center">
                <span className="text-[#FFFFFF] font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-[#0F172A]">Metrona</span>
            </a>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl">
              <form className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-14 border-2 border-[#F97316] rounded-sm focus:outline-none focus:border-[#EA580C] transition-colors text-[#0F172A]"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-6 bg-[#F97316] hover:bg-[#EA580C] transition-colors rounded-r-sm"
                >
                  <svg className="w-5 h-5 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              <div className="flex gap-3 mt-2 text-xs text-[#475569]">
                <a href="#" className="hover:text-[#F97316]">Áo thun</a>
                <a href="#" className="hover:text-[#F97316]">Giày sneaker</a>
                <a href="#" className="hover:text-[#F97316]">Túi xách</a>
                <a href="#" className="hover:text-[#F97316]">Đồng hồ</a>
              </div>
            </div>

            {/* Cart & User */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <button className="relative hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#F97316] text-[#FFFFFF] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-[#FFFFFF] font-bold text-sm overflow-hidden">
                      {user.avatar && !avatarError ? (
                        <img 
                          src={`http://localhost:3000${user.avatar}`}
                          alt={user.name} 
                          className="w-full h-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-[#0F172A]">{user.name}</span>
                      {getRoleBadge()}
                    </div>

                    <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] rounded-lg shadow-lg border border-[#E5E7EB] py-2">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-[#FFFFFF] font-bold overflow-hidden">
                            {user.avatar && !menuAvatarError ? (
                              <img 
                                src={`http://localhost:3000${user.avatar}`}
                                alt={user.name} 
                                className="w-full h-full object-cover"
                                onError={() => setMenuAvatarError(true)}
                              />
                            ) : (
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#0F172A] text-sm">{user.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {getRoleBadge()}
                            </div>
                            <p className="text-xs text-[#94A3B8] mt-1">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* View Mode Toggle for Sellers */}
                      {isSeller && (
                        <>
                          <button
                            onClick={toggleViewMode}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[#F8FAFC] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              <span className="text-[#0F172A]">
                                {viewMode === 'buyer' ? 'Chuyển sang bán hàng' : 'Chuyển sang mua hàng'}
                              </span>
                            </div>
                            <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <hr className="my-2 border-[#E5E7EB]" />
                        </>
                      )}

                      {/* Menu Items */}
                      <a
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#F97316]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Tài khoản của tôi
                      </a>
                      <a
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#F97316]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Đơn mua
                      </a>
                      
                      {isSeller && (
                        <a
                          href="/seller/products"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#F97316]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Quản lý sản phẩm
                        </a>
                      )}

                      <hr className="my-2 border-[#E5E7EB]" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEE2E2]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[#475569] hover:text-[#F97316] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
