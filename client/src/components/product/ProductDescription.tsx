'use client';

import { useState } from 'react';

export default function ProductDescription() {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'details'
                ? 'text-[#F97316]'
                : 'text-[#475569] hover:text-[#F97316]'
            }`}
          >
            Chi Tiết Sản Phẩm
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-[#F97316]'
                : 'text-[#475569] hover:text-[#F97316]'
            }`}
          >
            Đánh Giá <span className="text-[#94A3B8]">(1.2k)</span>
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'qa'
                ? 'text-[#F97316]'
                : 'text-[#475569] hover:text-[#F97316]'
            }`}
          >
            Tư Vấn Hỏi Đáp
            {activeTab === 'qa' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316]" />
            )}
          </button>
          <button
            className="ml-auto px-6 py-4 text-sm font-medium text-[#475569] hover:text-[#F97316]"
          >
            Gợi Ý Cho Bạn
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-6">Mô Tả Sản Phẩm</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <ul className="space-y-3 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Dung tích lớn máy xay mini tỏ vẫn kéo bền</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Dạ-nóng 600 ml, loại nhỏ uống sẵn và cùng nhóm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Nổi thông dạo ở bất đếc cung, quá dành, lịch xay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Hàng chuyển nhưởc xào uất đá ký cụy</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Bỏ mạnh, mạng, năng-nóng giảng lại</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Bỏ sơn chỉ bỏ đỏ đỏ đỏ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Thêm quên đỏa bạn gọn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316]">•</span>
                    <span>Có bảng dành hạp miền nhà mang</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Công Nghệ Ấn Phẩm</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Nhằm đưa/tức đa hàng của hàng. Sau khi xác<br />
                minh cuyết hồ sơ bạn có thể bắt đầu, bán hàng ngay!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
