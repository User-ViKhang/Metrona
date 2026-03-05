'use client';

export default function NotificationsView() {
  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#0F172A] mb-4">Thông Báo</h2>
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p className="text-[#94A3B8]">Chưa có thông báo nào</p>
      </div>
    </div>
  );
}
