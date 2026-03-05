'use client';

import { useState } from 'react';

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    { id: 0, alt: 'Product main' },
    { id: 1, alt: 'Product view 2' },
    { id: 2, alt: 'Product view 3' },
    { id: 3, alt: 'Product view 4' },
    { id: 4, alt: 'Product view 5' }
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6 sticky top-24">
      {/* Main Image */}
      <div className="relative aspect-square bg-[#F8FAFC] rounded-lg mb-4 flex items-center justify-center group">
        <svg className="w-48 h-48 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        {/* Zoom Icon */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-[#FFFFFF] rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image.id)}
            className={`flex-1 aspect-square bg-[#F8FAFC] rounded-lg flex items-center justify-center border-2 transition-colors ${
              selectedImage === image.id
                ? 'border-[#F97316]'
                : 'border-transparent hover:border-[#E5E7EB]'
            }`}
          >
            <svg className="w-12 h-12 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
