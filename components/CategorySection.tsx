import React from 'react';
import { CATEGORIES } from '../constants';
import { ViewType } from '../types';

interface CategorySectionProps {
  onCategoryClick?: (category: ViewType) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onCategoryClick }) => {
  const mapCategoryToView = (name: string): ViewType => {
    // Maps "Women", "Men", "Accessories" to ViewType
    return name as ViewType;
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {CATEGORIES.map((category) => (
          <div 
            key={category.id} 
            className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => onCategoryClick && onCategoryClick(mapCategoryToView(category.name))}
          >
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
               <h3 className="text-3xl text-white font-serif italic mb-4 opacity-100 translate-y-0 transition-all duration-300">
                {category.name}
               </h3>
               <button className="bg-white/90 backdrop-blur-sm text-stone-900 px-6 py-2 rounded-full text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 Shop Now
               </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};