'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  buyer: {
    name: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await api.getSellerOrders(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await api.confirmOrder(id);
      await loadOrders();
      setToastMessage('Đã xác nhận đơn hàng');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Không thể xác nhận đơn hàng');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleShip = async (id: string) => {
    try {
      await api.shipOrder(id);
      await loadOrders();
      setToastMessage('Đã chuyển sang trạng thái giao hàng');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Không thể cập nhật trạng thái');
      setToastType('error');
      setShowToast(true);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    SHIPPING: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-[#64748B]">Quản lý tất cả đơn hàng của cửa hàng</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-[#F97316] text-white'
                : 'bg-white text-[#475569] border border-[#E5E7EB] hover:bg-[#F8FAFC]'
            }`}
          >
            {status === 'all' ? 'Tất cả' : statusMap[status]?.label || status}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[#94A3B8]">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-[#0F172A]">Đơn hàng #{order.orderNumber}</p>
                  <p className="text-sm text-[#64748B]">
                    Khách hàng: {order.buyer?.name || 'N/A'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[order.status]?.color}`}>
                  {statusMap[order.status]?.label}
                </span>
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 mb-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-2">
                    <span className="text-[#475569]">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-[#0F172A] font-medium">
                      {((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                <div>
                  <p className="text-sm text-[#64748B]">Tổng tiền</p>
                  <p className="text-lg font-bold text-[#F97316]">
                    {(order.total || 0).toLocaleString('vi-VN')}vnđ
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'PENDING' && (
                    <Button variant="primary" onClick={() => handleConfirm(order.id)}>
                      Xác nhận
                    </Button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <Button variant="primary" onClick={() => handleShip(order.id)}>
                      Giao hàng
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
