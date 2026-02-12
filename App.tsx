
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { AIStylist } from './components/AIStylist';
import { Cart } from './components/Cart';
import { Profile } from './components/Profile';
import { ProductDetail } from './components/ProductDetail';
import { SignIn } from './components/SignIn';
import { Product, ViewType, CartItem } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [stylingProduct, setStylingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleNavigate = (view: ViewType) => {
    // Protected route check
    if (view === 'profile' && !isAuthenticated) {
      setCurrentView('signin');
      window.scrollTo(0, 0);
      return;
    }

    setCurrentView(view);
    if (view === 'home' || view === 'Women' || view === 'Men' || view === 'Accessories' || view === 'collection') {
      setStylingProduct(null);
      setViewingProduct(null);
      setSearchQuery(''); // Clear search on navigation
    }
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
    window.scrollTo(0, 0);
  };

  const handleStyleProduct = (product: Product) => {
    setStylingProduct(product);
    setCurrentView('stylist');
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('profile');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  // Enhanced Add to Cart to support size, color, quantity
  const handleAddToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    setCartItems(prev => {
      // Find item with exact same ID, Size, and Color
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        // Clone array
        const newItems = [...prev];
        // Update quantity
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return newItems;
      }
      
      // Add new item
      return [...prev, { 
        ...product, 
        quantity: quantity,
        selectedSize: size || product.sizes[0], // Fallback if quick adding
        selectedColor: color || product.colors[0] // Fallback if quick adding
      }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setCurrentView('signin');
      window.scrollTo(0, 0);
      return;
    }
    alert("Checkout functionality coming soon!");
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onExplore={() => handleNavigate('collection')} />
            <CategorySection onCategoryClick={handleNavigate} />
            <ProductGrid 
              onStyleProduct={handleStyleProduct}
              onAddToCart={(p) => handleAddToCart(p, undefined, undefined, 1)}
              onProductClick={handleViewProduct}
            />
          </>
        );
      case 'collection':
        return (
          <div className="pt-16 min-h-screen">
             <div className="relative bg-stone-900 py-24 px-6 text-center overflow-hidden">
               {/* Background subtle effect */}
               <div className="absolute inset-0 bg-stone-800 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="relative z-10 animate-fade-in-up">
                  <span className="uppercase tracking-[0.2em] text-xs font-bold text-stone-400 mb-4 block">Season 2024</span>
                  <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">The Full Collection</h1>
                  <p className="text-stone-300 max-w-lg mx-auto text-lg font-light leading-relaxed">
                    A curated selection of minimalist essentials. Explore quality craftsmanship and timeless design across all categories.
                  </p>
               </div>
             </div>
             <ProductGrid 
              title="All Products"
              onStyleProduct={handleStyleProduct} 
              onAddToCart={(p) => handleAddToCart(p, undefined, undefined, 1)}
              onProductClick={handleViewProduct}
             />
          </div>
        );
      case 'product':
        return viewingProduct ? (
          <ProductDetail 
            product={viewingProduct}
            onBack={() => handleNavigate('collection')}
            onAddToCart={handleAddToCart}
            onStyleWithAI={handleStyleProduct}
          />
        ) : (
          <div className="pt-32 text-center">Product not found. <button onClick={() => handleNavigate('home')} className="underline">Go Home</button></div>
        );
      case 'stylist':
        return (
          <AIStylist 
            product={stylingProduct} 
            onBack={() => handleNavigate('home')} 
          />
        );
      case 'cart':
        return (
          <Cart 
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onContinueShopping={() => handleNavigate('collection')}
          />
        );
      case 'signin':
        return (
          <SignIn 
            onSignIn={handleLogin} 
            onNavigate={() => handleNavigate('home')}
          />
        );
      case 'profile':
        return isAuthenticated ? (
          <Profile onLogout={handleLogout} />
        ) : (
          // Should normally be handled by the route guard in handleNavigate, but safe fallback
          <SignIn onSignIn={handleLogin} onNavigate={() => handleNavigate('home')} />
        );
      case 'search':
        return (
           <div className="pt-16 min-h-screen">
             <ProductGrid 
              onStyleProduct={handleStyleProduct}
              onAddToCart={(p) => handleAddToCart(p, undefined, undefined, 1)}
              onProductClick={handleViewProduct}
              searchQuery={searchQuery}
            />
           </div>
        );
      case 'Women':
      case 'Men':
      case 'Accessories':
        return (
          <div className="pt-16 min-h-screen">
             <div className="bg-stone-100 py-16 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">{currentView}</h1>
                <p className="text-stone-500 max-w-lg mx-auto">
                  Explore our exclusive collection of {currentView.toLowerCase()}. Timeless pieces crafted for the modern individual.
                </p>
             </div>
             <ProductGrid 
              onStyleProduct={handleStyleProduct} 
              onAddToCart={(p) => handleAddToCart(p, undefined, undefined, 1)}
              onProductClick={handleViewProduct}
              category={currentView} 
             />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hide Navbar on SignIn page for immersive effect */}
      {currentView !== 'signin' && (
        <Navbar 
          onNavigate={handleNavigate} 
          onSearch={handleSearch}
          currentView={currentView} 
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          isAuthenticated={isAuthenticated}
        />
      )}
      
      <main>
        {renderContent()}
      </main>
      
      {/* Hide Footer on SignIn page for immersive effect */}
      {currentView !== 'signin' && <Footer />}
    </div>
  );
}

export default App;
