'use client';

import { useState, useEffect } from 'react';

interface PriceInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function PriceInput({ 
  label, 
  name, 
  value, 
  onChange, 
  required, 
  placeholder = '0',
  disabled 
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Format number with dots
  const formatNumber = (num: string) => {
    const numOnly = num.replace(/\D/g, '');
    if (!numOnly) return '';
    return numOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Update display value when prop value changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    
    // Update display with formatted value
    setDisplayValue(formatNumber(numericValue));
    
    // Pass raw numeric value to parent
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: numericValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#475569] mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
      />
    </div>
  );
}
