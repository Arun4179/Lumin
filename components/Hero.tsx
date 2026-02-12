
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={HERO_IMAGE}
          alt="Fashion Campaign" 
          className="w-full h-full object-cover object-top"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end md:items-center justify-start max-w-7xl mx-auto px-6 pb-20 md:pb-0">
        <div className="max-w-xl space-y-6 text-white animate-fade-in-up">
          <span className="uppercase tracking-[0.2em] text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-sm border border-white/30">
            Spring Collection 2024
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
            Elegance in <br/> <span className="italic">Motion</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-100 font-light max-w-md">
            Discover our new season essentials. Minimalist silhouettes tailored for the modern individual.
          </p>
          <div className="pt-4">
             <button 
               onClick={onExplore}
               className="group bg-white text-stone-900 px-8 py-4 rounded-none md:rounded-sm font-medium transition-all hover:bg-stone-100 flex items-center space-x-2"
             >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
