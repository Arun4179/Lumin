import React, { useState } from 'react';
import { ArrowLeft, Star, Truck, ShieldCheck, ArrowRight, Sparkles, Minus, Plus, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onStyleWithAI: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, onStyleWithAI }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color.");
      return;
    }
    onAddToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-6 min-h-screen bg-stone-50">
      {/* Breadcrumb / Back Navigation */}
      <button 
        onClick={onBack} 
        className="flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="aspect-[3/4] w-full bg-stone-200 rounded-sm overflow-hidden relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.isNew && (
              <span className="absolute top-6 left-6 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                New Arrival
              </span>
            )}
          </div>
          {/* Thumbnail strip (Mockup for visual completeness) */}
          <div className="grid grid-cols-4 gap-4">
             {[...Array(3)].map((_, i) => (
               <div key={i} className={`aspect-[3/4] bg-stone-200 rounded-sm overflow-hidden cursor-pointer ${i === 0 ? 'ring-1 ring-stone-900' : 'opacity-70 hover:opacity-100'}`}>
                 <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="w-full lg:w-2/5 flex flex-col h-full sticky top-28">
          <div className="border-b border-stone-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-serif text-stone-900 leading-tight">
                {product.name}
              </h1>
              <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                <Heart size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-medium text-stone-900">${product.price.toFixed(2)}</span>
              <div className="flex items-center text-stone-500 text-sm">
                 <div className="flex text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
                 <span>(12 Reviews)</span>
              </div>
            </div>

            <p className="text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Selectors */}
          <div className="space-y-8 mb-8">
            {/* Color Selector */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 block">
                Color: <span className="text-stone-500 font-normal capitalize">{selectedColor || 'Select a color'}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === color 
                        ? 'ring-2 ring-offset-2 ring-stone-900 scale-110' 
                        : 'hover:scale-110'
                    }`}
                    title={color}
                  >
                    <div className="w-full h-full rounded-full border border-stone-200" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Size: <span className="text-stone-500 font-normal">{selectedSize || 'Select a size'}</span>
                </span>
                <button className="text-xs underline text-stone-500 hover:text-stone-900">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-medium border rounded-md transition-all ${
                      selectedSize === size
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
             <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 block">Quantity</span>
              <div className="flex items-center w-32 border border-stone-200 rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-medium text-stone-900">{quantity}</span>
                 <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-stone-900 text-white py-4 px-6 rounded-sm font-medium hover:bg-stone-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group"
            >
              ADD TO BAG
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => onStyleWithAI(product)}
              className="w-full bg-stone-100 text-stone-900 border border-stone-200 py-4 px-6 rounded-sm font-medium hover:bg-white hover:border-stone-300 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles size={18} className="text-stone-400 group-hover:text-yellow-500 transition-colors" />
              ASK AI STYLIST
            </button>
          </div>

          {/* Info Accordions */}
          <div className="space-y-4 border-t border-stone-200 pt-6">
            <div className="flex items-start gap-4">
               <Truck className="text-stone-400 shrink-0" size={20} />
               <div>
                 <h4 className="text-sm font-bold text-stone-900 mb-1">Free Shipping & Returns</h4>
                 <p className="text-xs text-stone-500">Free standard shipping on orders over $150. Returns accepted within 30 days.</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <ShieldCheck className="text-stone-400 shrink-0" size={20} />
               <div>
                 <h4 className="text-sm font-bold text-stone-900 mb-1">Quality Guarantee</h4>
                 <p className="text-xs text-stone-500">{product.material || "Premium materials"} crafted for longevity and comfort.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};