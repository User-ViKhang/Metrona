'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function ProfileSidebar({ activeView, onViewChange }: ProfileSidebarProps) {
  const { user, logout } = useAuth();

  const handleMenuClick = (id: string) => {
    if (id === 'logout') {
      logout();
      window.location.href = '/';
    } else {
      onViewChange(id);
    }
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'Tài khoản của tôi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Đơn mua',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      badge: 12
    },
    {
      id: 'favorites',
      label: 'Sản phẩm yêu thích',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      id: 'addresses',
      label: 'Sổ địa chỉ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm overflow-hidden sticky top-[164px]">
      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
              activeView === item.id
                ? 'bg-[#FFEDD5] text-[#F97316]'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-[#EF4444] text-[#FFFFFF] text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
