
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="w-full flex-1 flex flex-col">
      {children}
    </div>
  );
};

export default PageTransition;
