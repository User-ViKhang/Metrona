'use client';

import { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  store: string;
  storeVerified: boolean;
  price: number;
  originalPrice: number;
  quantity: number;
  voucher?: string;
  flashSale?: boolean;
  selected: boolean;
}

export default function CartItems() {
  const [selectAll, setSelectAll] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Máy Xay Sinh Tố Cầm Tay Mini Đa Năng Comet - Dung Tích 350ml',
      store: 'CometOffitial Store',
      storeVerified: true,
      price: 390000,
      originalPrice: 800000,
      quantity: 1,
      voucher: 'Giảm 40k',
      selected: true
    },
    {
      id: 2,
      name: 'Tai Nghe Bluetooth Không Dây TWS, Cảm Ứng Thông Minh',
      store: 'TechPlus',
      storeVerified: false,
      price: 399000,
      originalPrice: 599000,
      quantity: 1,
      flashSale: true,
      selected: true
    },
    {
      id: 3,
      name: 'Giá Đỡ Điện Thoại & Máy Tính Bảng Cáp Con.',
      store: 'BELO Home',
      storeVerified: true,
      price: 179000,
      originalPrice: 350000,
      quantity: 1,
      selected: true
    }
  ]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems(items.map(item => ({ ...item, selected: newSelectAll })));
  };

  const handleSelectItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Select All */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-5 h-5 text-[#F97316] border-[#E5E7EB] rounded focus:ring-[#F97316]"
          />
          <span className="text-sm font-medium text-[#0F172A]">Sản Chọn Ai</span>
          <span className="text-sm text-[#94A3B8] ml-auto">
            Thông thức nhận tay: <span className="font-medium text-[#F97316]">6.999đ</span>
          </span>
        </label>
      </div>

      {/* Cart Items */}
      {items.map((item) => (
        <div key={item.id} className="bg-[#FFFFFF] rounded-lg shadow-sm">
          {/* Store Header */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => handleSelectItem(item.id)}
              className="w-5 h-5 text-[#F97316] border-[#E5E7EB] rounded focus:ring-[#F97316]"
            />
            {item.flashSale && (
              <span className="px-2 py-1 bg-[#EF4444] text-[#FFFFFF] text-xs font-bold rounded">
                Flash Sale
              </span>
            )}
            <span className="font-medium text-[#0F172A]">{item.store}</span>
            {item.storeVerified && (
              <svg className="w-4 h-4 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {item.flashSale && (
              <span className="text-xs text-[#EF4444] ml-auto">7 Phút 43s</span>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 flex gap-4">
            <div className="w-24 h-24 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-12 h-12 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#0F172A] mb-2">{item.name}</h3>
              <p className="text-xs text-[#94A3B8] mb-2">Bản hàng: 10.98.8.4b</p>
              
              {item.voucher && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-medium rounded">
                    Voucher: {item.voucher}
                  </span>
                  <span className="px-2 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-medium rounded">
                    Mua 2 - 10k
                  </span>
                  <button className="text-xs text-[#F97316] hover:text-[#EA580C]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs text-[#475569] hover:text-[#F97316]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Lưu Để Đánh
                </button>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="flex items-center gap-1 text-xs text-[#475569] hover:text-[#EF4444]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="text-right">
                <p className="text-xs text-[#94A3B8] line-through mb-1">
                  {item.originalPrice.toLocaleString()}đ
                </p>
                <p className="text-lg font-bold text-[#F97316]">
                  {item.price.toLocaleString()}đ
                </p>
                <p className="text-xs text-[#94A3B8]">5 Gói kí tối giá</p>
              </div>

              <div className="flex items-center border border-[#E5E7EB] rounded">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    setItems(items.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i));
                  }}
                  className="w-12 h-8 text-center border-x border-[#E5E7EB] focus:outline-none text-sm"
                />
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
