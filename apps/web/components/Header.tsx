import React from 'react';
import { Search, User, Menu } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <span className="text-brand font-bold text-xl hidden md:block tracking-tight">itvara</span>
        </div>

        {/* Floating Search Bar Trigger */}
        <div className="hidden md:flex flex-1 max-w-sm mx-auto shadow-search-bar rounded-pill border border-neutral-200 bg-white items-center p-2 cursor-pointer transition-shadow hover:shadow-stay-card">
          <div className="flex-1 px-4 text-sm font-medium text-neutralDark">Anywhere</div>
          <div className="w-px h-6 bg-neutral-200 mx-2"></div>
          <div className="flex-1 px-4 text-sm font-medium text-neutralDark">Any week</div>
          <div className="w-px h-6 bg-neutral-200 mx-2"></div>
          <div className="flex-1 px-4 text-sm text-neutral-500 font-normal">Add guests</div>
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center ml-2">
            <Search size={16} color="white" />
          </div>
        </div>

        {/* Profile Action Dropdown Trigger */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:block text-sm font-semibold text-neutralDark cursor-pointer hover:bg-neutral-100 px-4 py-2 rounded-pill">
            Itvara your home
          </span>
          <div className="flex items-center gap-3 border border-neutral-300 rounded-pill p-2 hover:shadow-sm cursor-pointer transition-shadow bg-white">
            <Menu size={18} className="text-neutralDark ml-2" />
            <div className="w-8 h-8 bg-neutral-500 rounded-full flex items-center justify-center overflow-hidden">
              <User size={20} color="white" className="mt-1" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
