import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onContinueShopping 
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-stone-400" />
        </div>
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Your bag is empty</h2>
        <p className="text-stone-500 mb-8 max-w-md">
          Looks like you haven't added any pieces to your collection yet.
        </p>
        <button 
          onClick={onContinueShopping}
          className="bg-stone-900 text-white px-8 py-3 rounded-sm font-medium hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <h1 className="text-4xl font-serif text-stone-900 mb-12">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Cart Items List */}
        <div className="flex-1 w-full space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6 border-b border-stone-100 animate-in slide-in-from-bottom-4 duration-500">
              {/* Product Image */}
              <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-stone-900">{item.name}</h3>
                    <p className="text-lg font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-stone-500 mb-1">{item.category}</p>
                  <p className="text-sm text-stone-500">
                    {item.sizes.length > 0 ? (item.selectedSize || item.sizes[0]) : 'One Size'} 
                    {item.colors.length > 0 ? ` • ${item.selectedColor || item.colors[0]}` : ''}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-stone-200 rounded-md">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors p-2 text-sm flex items-center gap-1 group"
                  >
                    <Trash2 size={16} className="group-hover:stroke-red-500" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-stone-50 p-8 rounded-2xl sticky top-28 h-auto">
          <h3 className="text-xl font-serif text-stone-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4 text-sm text-stone-600 mb-8 border-b border-stone-200 pb-8">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Estimate</span>
              <span className="font-medium text-stone-900">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-stone-500 italic">Free shipping applied on orders over $150</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-medium text-stone-900">Total</span>
            <span className="text-2xl font-serif text-stone-900">${total.toFixed(2)}</span>
          </div>

          <button 
            onClick={onCheckout}
            className="w-full bg-stone-900 text-white py-4 px-6 rounded-sm font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 group"
          >
            Checkout
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-6 text-center">
            <button 
              onClick={onContinueShopping}
              className="text-sm text-stone-500 hover:text-stone-900 underline underline-offset-4"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};