'use client';

export default function FeatureBar() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Miễn Phí Ship',
      color: 'bg-[#FFEDD5]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Đặc biệt Hôm Nay',
      badge: 'HOT',
      color: 'bg-[#FEE2E2]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Mã Giảm Giá',
      color: 'bg-[#DBEAFE]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      title: 'Săn Coupon',
      color: 'bg-[#FFEDD5]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Giảm đặc biệt',
      badge: 'Flash Sale',
      color: 'bg-[#FEE2E2]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flash Sale',
      subtitle: '1h 30m 23s',
      color: 'bg-[#F97316]',
      textColor: 'text-[#FFFFFF]'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 flex-1">
            <div className={`${feature.color} ${feature.textColor || 'text-[#F97316]'} p-3 rounded-lg`}>
              {feature.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${feature.textColor || 'text-[#0F172A]'}`}>
                  {feature.title}
                </span>
                {feature.badge && (
                  <span className="text-xs bg-[#EF4444] text-[#FFFFFF] px-2 py-0.5 rounded">
                    {feature.badge}
                  </span>
                )}
              </div>
              {feature.subtitle && (
                <span className={`text-xs ${feature.textColor || 'text-[#94A3B8]'}`}>
                  {feature.subtitle}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
