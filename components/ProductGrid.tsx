
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, ChevronDown, X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

type SortOption = 'newest' | 'price-asc' | 'price-desc';
type PriceRange = 'all' | '0-50' | '50-100' | '100+';

interface ProductGridProps {
  onStyleProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  category?: string; // Optional category prop
  searchQuery?: string; // Optional search query
  title?: string; // Optional custom title
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onStyleProduct, onAddToCart, onProductClick, category, searchQuery, title }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // State for managing dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // 1. Search Filter (Highest priority)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.colors.some(c => c.toLowerCase().includes(query)) ||
          product.material?.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // 2. Category Filter (Only if search is not active, or if strictly enforced in future)
      if (!searchQuery && category && product.category !== category) return false;

      // 3. User Filters
      if (selectedSize && !product.sizes.includes(selectedSize)) return false;
      if (selectedColor && !product.colors.includes(selectedColor)) return false;
      
      if (selectedPrice !== 'all') {
        if (selectedPrice === '0-50' && product.price > 50) return false;
        if (selectedPrice === '50-100' && (product.price <= 50 || product.price > 100)) return false;
        if (selectedPrice === '100+' && product.price <= 100) return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default to 'newest'
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [selectedSize, selectedColor, selectedPrice, sortBy, category, searchQuery]);

  // Derived unique options for filters based on *available* products in this context
  const relevantProducts = useMemo(() => {
    if (searchQuery) return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (category) return PRODUCTS.filter(p => p.category === category);
    return PRODUCTS;
  }, [category, searchQuery]);

  const allSizes = Array.from(new Set(relevantProducts.flatMap(p => p.sizes))).sort();
  const allColors = Array.from(new Set(relevantProducts.flatMap(p => p.colors))).sort();

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const clearFilters = () => {
    setSelectedSize('');
    setSelectedColor('');
    setSelectedPrice('all');
    setSortBy('newest');
    setActiveDropdown(null);
  };

  const hasActiveFilters = selectedSize || selectedColor || selectedPrice !== 'all';

  const renderTitle = () => {
    if (title) return title;
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (category) return `${category}'s Collection`;
    return 'Featured Products';
  };

  const renderSubtitle = () => {
    if (searchQuery) return `Found ${filteredProducts.length} items matching your search.`;
    if (category) return `Explore our latest styles in ${category.toLowerCase()}.`;
    return 'Curated essentials for your wardrobe.';
  };

  return (
    <section className="py-20 bg-stone-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">
                {renderTitle()}
              </h2>
              <p className="text-stone-500 font-light">
                {renderSubtitle()}
              </p>
            </div>
            
            {!category && !searchQuery && !title && (
              <a href="#" className="hidden md:block text-stone-900 font-medium hover:text-stone-600 underline-offset-4 hover:underline">
                View All Products
              </a>
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-stone-200 py-4">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <span className="flex items-center text-sm font-medium text-stone-900 mr-2">
                <SlidersHorizontal size={16} className="mr-2" /> Filter by:
              </span>

              {/* Size Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('size')}
                  className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                    selectedSize 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                  disabled={allSizes.length === 0}
                >
                  <span>{selectedSize || 'Size'}</span>
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'size' && allSizes.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-stone-100 z-30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     {allSizes.map(size => (
                       <button
                         key={size}
                         onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setActiveDropdown(null); }}
                         className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                           selectedSize === size ? 'bg-stone-100 font-medium' : 'hover:bg-stone-50 text-stone-600'
                         }`}
                       >
                         {size}
                         {selectedSize === size && <Check size={14} />}
                       </button>
                     ))}
                  </div>
                )}
              </div>

              {/* Color Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('color')}
                  className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                    selectedColor 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                  disabled={allColors.length === 0}
                >
                  <span>{selectedColor || 'Color'}</span>
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'color' && allColors.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-stone-100 z-30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     {allColors.map(color => (
                       <button
                         key={color}
                         onClick={() => { setSelectedColor(selectedColor === color ? '' : color); setActiveDropdown(null); }}
                         className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                           selectedColor === color ? 'bg-stone-100 font-medium' : 'hover:bg-stone-50 text-stone-600'
                         }`}
                       >
                         {color}
                         {selectedColor === color && <Check size={14} />}
                       </button>
                     ))}
                  </div>
                )}
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('price')}
                  className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                    selectedPrice !== 'all'
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span>
                    {selectedPrice === 'all' ? 'Price' : selectedPrice === '0-50' ? 'Under $50' : selectedPrice === '50-100' ? '$50 - $100' : '$100+'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'price' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 z-30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     {[
                       { value: 'all', label: 'All Prices' },
                       { value: '0-50', label: 'Under $50' },
                       { value: '50-100', label: '$50 - $100' },
                       { value: '100+', label: '$100 & Above' }
                     ].map((option) => (
                       <button
                         key={option.value}
                         onClick={() => { setSelectedPrice(option.value as PriceRange); setActiveDropdown(null); }}
                         className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                           selectedPrice === option.value ? 'bg-stone-100 font-medium' : 'hover:bg-stone-50 text-stone-600'
                         }`}
                       >
                         {option.label}
                         {selectedPrice === option.value && <Check size={14} />}
                       </button>
                     ))}
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="flex items-center text-xs text-stone-500 hover:text-red-600 underline underline-offset-2 ml-2 transition-colors"
                >
                  Clear all <X size={12} className="ml-1" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative z-20">
              <button 
                  onClick={() => toggleDropdown('sort')}
                  className="flex items-center space-x-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <span className="text-stone-400 font-normal mr-1">Sort by:</span>
                  <span>
                    {sortBy === 'newest' ? 'Newest' : sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'sort' && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     {[
                       { value: 'newest', label: 'Newest Arrivals' },
                       { value: 'price-asc', label: 'Price: Low to High' },
                       { value: 'price-desc', label: 'Price: High to Low' }
                     ].map((option) => (
                       <button
                         key={option.value}
                         onClick={() => { setSortBy(option.value as SortOption); setActiveDropdown(null); }}
                         className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                           sortBy === option.value ? 'bg-stone-100 font-medium' : 'hover:bg-stone-50 text-stone-600'
                         }`}
                       >
                         {option.label}
                         {sortBy === option.value && <Check size={14} />}
                       </button>
                     ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                      New In
                    </span>
                  )}

                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    {/* Style with AI Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStyleProduct(product);
                      }}
                      className="bg-stone-900/90 backdrop-blur text-white p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-stone-800"
                      title="Style with AI"
                    >
                      <Sparkles size={20} />
                    </button>
                    
                    {/* Quick Add Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="bg-white text-stone-900 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-stone-900 hover:text-white"
                      title="Quick Add"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-lg font-medium text-stone-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-stone-500">{product.category}</p>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map(color => (
                        <div key={color} className="w-2 h-2 rounded-full bg-stone-300 ring-1 ring-stone-100" title={color} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Sparkles size={24} className="text-stone-400" />
             </div>
             <p className="text-stone-900 text-lg font-medium mb-1">No matches found</p>
             <p className="text-stone-500 max-w-xs mx-auto mb-6">
               We couldn't find any products matching "{searchQuery}". Try adjusting your search or filters.
             </p>
             <button 
              onClick={clearFilters}
              className="text-stone-900 font-medium hover:underline underline-offset-4"
             >
               Clear all filters
             </button>
          </div>
        )}
      </div>
    </section>
  );
};
