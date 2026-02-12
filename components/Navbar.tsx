
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, User, Sparkles } from 'lucide-react';
import { ViewType } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewType) => void;
  onSearch: (query: string) => void;
  currentView: ViewType;
  cartCount: number;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onSearch, currentView, cartCount, isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isSearchOpen && !searchQuery) {
          setIsSearchOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, searchQuery]);

  // Lock body scroll only for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      handleNavClick('profile');
    } else {
      handleNavClick('signin');
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isScrolled || currentView !== 'home' 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
            
            {/* Mobile Search Overlay - Covers the navbar content on mobile when open */}
            <div 
              className={`md:hidden absolute inset-0 -mx-6 px-6 bg-white z-20 flex items-center justify-between transition-all duration-300 ${
                isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
              }`}
            >
               <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                  <Search size={20} className="text-stone-400 mr-3" />
                  <input 
                    ref={isSearchOpen ? searchInputRef : null}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search store..." 
                    className="flex-1 bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400 text-base h-10"
                  />
               </form>
               <button onClick={() => setIsSearchOpen(false)} className="p-2 -mr-2 text-stone-500">
                  <X size={20} />
               </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-full transition-colors ${isSearchOpen ? 'invisible' : ''}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <div 
              className={`text-2xl font-serif font-bold tracking-tighter text-stone-900 cursor-pointer select-none ${isSearchOpen ? 'invisible md:visible' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              LUMIÈRE
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-10 text-xs font-medium tracking-widest text-stone-600 uppercase">
              <button onClick={() => handleNavClick('home')} className={`hover:text-stone-900 transition-all duration-300 ${currentView === 'home' ? 'text-stone-900' : ''}`}>New Arrivals</button>
              <button onClick={() => handleNavClick('Women')} className={`hover:text-stone-900 transition-all duration-300 ${currentView === 'Women' ? 'text-stone-900' : ''}`}>Women</button>
              <button onClick={() => handleNavClick('Men')} className={`hover:text-stone-900 transition-all duration-300 ${currentView === 'Men' ? 'text-stone-900' : ''}`}>Men</button>
              <button onClick={() => handleNavClick('Accessories')} className={`hover:text-stone-900 transition-all duration-300 ${currentView === 'Accessories' ? 'text-stone-900' : ''}`}>Accessories</button>
              <button 
                onClick={() => handleNavClick('stylist')} 
                className={`flex items-center gap-1 hover:text-stone-900 transition-all duration-300 ${currentView === 'stylist' ? 'text-stone-900' : ''}`}
              >
                <Sparkles size={14} className="text-stone-400" />
                AI Stylist
              </button>
            </div>

            {/* Icons Section */}
            <div className={`flex items-center space-x-2 md:space-x-4 ${isSearchOpen ? 'invisible md:visible' : ''}`}>
              
              {/* Expandable Search Bar (Desktop) */}
              <div 
                ref={searchContainerRef}
                className={`hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  isSearchOpen 
                    ? 'bg-stone-50 border border-stone-200 pl-3 pr-2 py-1.5 rounded-full w-64 shadow-inner' 
                    : 'w-10 bg-transparent'
                }`}
              >
                 <button 
                    onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                    className="shrink-0 flex items-center justify-center"
                 >
                    <Search 
                      size={20} 
                      strokeWidth={1.5} 
                      className={`transition-colors ${isSearchOpen ? 'text-stone-400' : 'text-stone-800 hover:text-stone-500'}`} 
                    />
                 </button>

                 <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    isSearchOpen ? 'w-full opacity-100 ml-2' : 'w-0 opacity-0'
                 }`}>
                    <form onSubmit={handleSearchSubmit}>
                      <input 
                         ref={!isMobileMenuOpen ? searchInputRef : null}
                         type="text"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search..."
                         className="w-full bg-transparent border-none outline-none text-sm text-stone-900 placeholder:text-stone-400 h-full py-0"
                         autoComplete="off"
                      />
                    </form>
                 </div>

                 {isSearchOpen && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsSearchOpen(false);
                       setSearchQuery('');
                     }} 
                     className="shrink-0 ml-1 p-0.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
                   >
                     <X size={14} />
                   </button>
                 )}
              </div>
              
              {/* Mobile Search Trigger Icon */}
              <button 
                className="md:hidden p-2 text-stone-800 hover:text-stone-500 transition-colors rounded-full hover:bg-stone-50"
                onClick={() => setIsSearchOpen(true)}
              >
                 <Search size={20} strokeWidth={1.5} />
              </button>

              <button 
                onClick={handleProfileClick}
                className={`hidden sm:block p-2 transition-colors rounded-full hover:bg-stone-50 ${currentView === 'profile' || currentView === 'signin' ? 'text-stone-900' : 'text-stone-800 hover:text-stone-500'}`}
                title={isAuthenticated ? 'My Profile' : 'Sign In'}
              >
                <User size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => handleNavClick('cart')}
                className="p-2 text-stone-800 hover:text-stone-500 transition-colors relative rounded-full hover:bg-stone-50"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-stone-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white transform transition-transform duration-500 cubic-bezier(0.32,0.72,0,1) ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-stone-100">
             <div className="text-2xl font-serif font-bold tracking-tighter text-stone-900">
              LUMIÈRE
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-500 hover:text-stone-900">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col p-8 space-y-6 text-2xl font-serif font-medium text-stone-900">
            <button onClick={() => handleNavClick('home')} className="text-left hover:text-stone-500 transition-colors">New Arrivals</button>
            <button onClick={() => handleNavClick('Women')} className="text-left hover:text-stone-500 transition-colors">Women</button>
            <button onClick={() => handleNavClick('Men')} className="text-left hover:text-stone-500 transition-colors">Men</button>
            <button onClick={() => handleNavClick('Accessories')} className="text-left hover:text-stone-500 transition-colors">Accessories</button>
            <button onClick={() => handleNavClick('stylist')} className="text-left flex items-center gap-3 hover:text-stone-500 transition-colors">
              <Sparkles size={24} className="text-stone-400" />
              AI Stylist
            </button>
          </div>
          <div className="mt-auto p-8 bg-stone-50">
             <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 text-stone-600 hover:text-stone-900"
                >
                  <User size={20} />
                  <span className="font-medium">{isAuthenticated ? 'My Account' : 'Sign In'}</span>
                </button>
                <button 
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     setIsSearchOpen(true);
                   }}
                   className="flex items-center space-x-3 text-stone-600 hover:text-stone-900"
                >
                  <Search size={20} />
                  <span className="font-medium">Search Store</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};
