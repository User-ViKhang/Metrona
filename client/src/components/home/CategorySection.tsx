'use client';

export default function CategorySection() {
  const categories = [
    { id: 1, name: 'Phụ Kiện', icon: '📱' },
    { id: 2, name: 'Thiết Bị Gia Dụng', icon: '🏠' },
    { id: 3, name: 'Thiết Bị Điện Tử', icon: '💻' },
    { id: 4, name: 'Đồ Dùng Nhà Bếp', icon: '🍳' },
    { id: 5, name: 'Dụng Cụ Làm Đẹp', icon: '💄' }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Danh Mục Phổ Biến</h2>
      
      <div className="grid grid-cols-5 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group cursor-pointer"
          >
            <div className="aspect-square bg-[#F8FAFC] rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-[#FFEDD5] transition-colors border border-[#E5E7EB] group-hover:border-[#F97316]">
              <span className="text-5xl">{category.icon}</span>
              <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#F97316]">
                {category.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
