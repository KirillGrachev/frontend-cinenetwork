
import React from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className = '' }) => {
  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={onChange}
      className={`group flex items-center gap-3 cursor-pointer py-1.5 transition-opacity duration-300 hover:opacity-90 focus:outline-none ${className}`}
    >
      <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-300 ring-offset-2 ring-offset-black ${checked ? 'bg-white border-white' : 'bg-item-primary border-border-medium group-hover:border-border-focus'}`}>
        <i className={`fa-solid fa-check text-black text-[10px] transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`}></i>
      </div>
      {label && <span className={`text-sm font-medium transition-colors duration-300 ${checked ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{label}</span>}
    </HeadlessCheckbox>
  );
};

export default Checkbox;
