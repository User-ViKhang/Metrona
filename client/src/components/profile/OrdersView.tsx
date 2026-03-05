'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    images: Array<{
      url: string;
    }>;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  createdAt: string;
  shop: {
    id: string;
    name: string;
    logo?: string;
  };
  items: OrderItem[];
}

interface OrderStats {
  pending: number;
  shipping: number;
  completed: number;
}

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({ pending: 0, shipping: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (activeTab !== 'ALL') {
        params.status = activeTab;
      }
      
      const response = await api.getOrders(params);
      const ordersData = response.data || response;
      setOrders(ordersData);
      
      // Calculate stats
      calculateStats(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const pending = ordersData.filter(o => o.status === 'PENDING').length;
    const shipping = ordersData.filter(o => o.status === 'SHIPPING').length;
    const completed = ordersData.filter(o => o.status === 'COMPLETED').length;
    setStats({ pending, shipping, completed });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      PENDING: { text: 'Chờ thanh toán', color: 'bg-[#FACC15] text-[#78350F]' },
      CONFIRMED: { text: 'Chờ vận chuyển', color: 'bg-[#2563EB] text-[#FFFFFF]' },
      SHIPPING: { text: 'Đang giao hàng', color: 'bg-[#F97316] text-[#FFFFFF]' },
      DELIVERED: { text: 'Đã giao hàng', color: 'bg-[#10B981] text-[#FFFFFF]' },
      COMPLETED: { text: 'Hoàn thành', color: 'bg-[#22C55E] text-[#FFFFFF]' },
      CANCELLED: { text: 'Đã hủy', color: 'bg-[#EF4444] text-[#FFFFFF]' },
    };

    const badge = statusMap[status] || { text: status, color: 'bg-[#94A3B8] text-[#FFFFFF]' };
    return (
      <span className={`${badge.color} text-xs px-3 py-1 rounded-full`}>
        {badge.text}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const tabs = [
    { id: 'ALL', label: 'Tất cả', icon: null },
    { id: 'PENDING', label: 'Chờ thanh toán', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'CONFIRMED', label: 'Chờ vận chuyển', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { id: 'SHIPPING', label: 'Đang giao', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
    { id: 'COMPLETED', label: 'Hoàn thành', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'CANCELLED', label: 'Đã hủy', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <p className="text-center text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#475569]">Chờ thanh toán</h3>
            <div className="w-12 h-12 bg-[#FFEDD5] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.pending}</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#475569]">Đang giao hàng</h3>
            <div className="w-12 h-12 bg-[#FFEDD5] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.shipping}</p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#475569]">Hoàn thành</h3>
            <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{stats.completed}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-[#E5E7EB]">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#F97316] text-[#F97316]'
                    : 'border-transparent text-[#475569] hover:text-[#F97316]'
                }`}
              >
                {tab.icon && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-[#94A3B8]">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#F97316] transition-colors">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#0F172A]">#{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                      <span className="text-sm text-[#94A3B8]">|</span>
                      <span className="text-sm text-[#475569]">{order.shop.name}</span>
                    </div>
                    <span className="text-sm text-[#94A3B8]">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-sm flex items-center justify-center overflow-hidden">
                          {item.product.images[0] ? (
                            <img 
                              src={`http://localhost:3000${item.product.images[0].url}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0F172A] mb-1">{item.name}</p>
                          <p className="text-xs text-[#94A3B8]">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#0F172A]">{formatPrice(Number(item.price))}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                    <span className="text-sm text-[#475569]">Tổng cộng:</span>
                    <span className="text-lg font-bold text-[#F97316]">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
