'use client';

export default function ProductQA() {
  const questions = [
    {
      id: 1,
      question: 'Máy xay này có sạc được qua USB không?',
      answer: 'Có, máy có thể sạc qua cổng USB tiện lợi'
    },
    {
      id: 2,
      question: 'Lưỡi dao làm bằng gì?',
      answer: 'Lưỡi dao làm bằng thép không gỉ cao cấp'
    },
    {
      id: 3,
      question: 'Dung tích bao gồm cả thời lớ?',
      answer: 'Dung tích 350ml là dung tích thực tế sử dụng'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0F172A]">Có Thể Bạn Cũng Thích</h2>
        <button className="text-sm text-[#F97316] hover:text-[#EA580C] flex items-center gap-1">
          Xem tất cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((item) => (
          <div key={item.id} className="border border-[#E5E7EB] rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-[#FEF9C3] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#FACC15] font-bold">Q</span>
              </div>
              <p className="text-sm font-medium text-[#0F172A] flex-1">{item.question}</p>
            </div>
            <div className="flex items-start gap-3 ml-11">
              <div className="w-8 h-8 bg-[#DCFCE7] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#22C55E] font-bold">A</span>
              </div>
              <p className="text-sm text-[#475569] flex-1">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question */}
      <div className="mt-6 p-4 bg-[#F8FAFC] rounded-lg flex items-center gap-4">
        <img src="/placeholder-avatar.png" alt="User" className="w-12 h-12 rounded-full bg-[#E5E7EB]" />
        <input
          type="text"
          placeholder="Đặt câu hỏi về sản phẩm..."
          className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:border-[#F97316]"
        />
        <button className="px-6 py-2 bg-[#F97316] text-[#FFFFFF] rounded-md text-sm font-medium hover:bg-[#EA580C] transition-colors">
          Gửi
        </button>
      </div>
    </div>
  );
}
