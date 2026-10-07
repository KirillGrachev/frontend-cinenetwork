
import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';

interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ title, children, isOpen = true }) => {
  return (
    <div className="border-b border-border-light py-5 last:border-0">
      <Disclosure defaultOpen={isOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full group mb-2 focus:outline-none focus:text-white transition-all duration-300 active:opacity-70">
              <h3 className="font-bold text-white text-base group-hover:text-gray-300 transition-colors duration-300">{title}</h3>
              <i className={`fa-solid fa-chevron-down text-xs text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}></i>
            </Disclosure.Button>
            
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="pt-2">
                {children}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FilterAccordion;
