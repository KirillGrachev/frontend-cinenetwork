
import React from 'react';
import NavbarLogo from './navbar/NavbarLogo';
import NavbarDesktopNav from './navbar/NavbarDesktopNav';
import NavbarActions from './navbar/NavbarActions';
import { useNavbarLogic } from '../hooks/useNavbarLogic';
import { useNavigate, useLocation } from 'react-router';
import { AppRoute } from '../types';

interface NavbarProps {
  onOpenPost: (id: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
    onOpenPost,
}) => {
  const { state } = useNavbarLogic();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchInputRef } = state;
  
  const isAuthPage = location.pathname === AppRoute.Login || location.pathname === AppRoute.Register;

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none">
      {/** Solid dark background matching footer */}
      <div className="absolute inset-0 h-full bg-background-secondary border-b border-border-light"></div>
      <div className="relative container mx-auto flex items-center justify-between pointer-events-auto px-4 md:px-8 h-[72px]">
        
        {/** Fixed-width left slot to prevent middle nav shift on reload */}
        <div className="w-[180px] md:w-[220px] flex items-center justify-start shrink-0">
          <NavbarLogo 
              onClick={() => navigate(AppRoute.Home)} 
          />
        </div>

        {/** Perfectly centered middle nav */}
        <div className="flex-1 flex justify-center px-2 min-w-0">
          <NavbarDesktopNav 
              onOpenPost={onOpenPost}
              searchInputRef={searchInputRef}
          />
        </div>

        {/** Fixed-width right slot matching left slot */}
        <div className="w-[180px] md:w-[220px] flex items-center justify-end shrink-0">
          <NavbarActions 
              isAuthPage={isAuthPage}
          />
        </div>

      </div>
    </nav>
    </>
  );
};

export default Navbar;
