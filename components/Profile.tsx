import React, { useState } from 'react';
import { Package, User, MapPin, CreditCard, Settings, LogOut, ChevronRight, Box } from 'lucide-react';
import { MOCK_ORDERS, MOCK_USER } from '../constants';
import { Order, UserProfile } from '../types';

interface ProfileProps {
  onLogout?: () => void;
}

type Tab = 'orders' | 'profile' | 'addresses' | 'settings';

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [user] = useState<UserProfile>(MOCK_USER);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-serif text-stone-900 mb-6">My Orders</h2>
      {MOCK_ORDERS.length > 0 ? (
        MOCK_ORDERS.map((order) => (
          <div key={order.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex flex-wrap gap-4 justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Order Placed</p>
                <p className="text-sm font-medium text-stone-900">{order.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total</p>
                <p className="text-sm font-medium text-stone-900">${order.total.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Order #</p>
                <p className="text-sm font-medium text-stone-900">{order.id}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-item-${idx}`} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-stone-900 truncate">{item.name}</h4>
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {item.selectedSize && `Size: ${item.selectedSize}`} 
                        {item.selectedColor && ` • Color: ${item.selectedColor}`}
                      </p>
                    </div>
                    <div className="text-right">
                       <button className="text-sm text-stone-900 font-medium hover:underline">Write Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
          <Box className="mx-auto h-12 w-12 text-stone-300 mb-4" />
          <h3 className="text-lg font-medium text-stone-900">No orders yet</h3>
          <p className="text-stone-500">When you place an order, it will appear here.</p>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-serif text-stone-900 mb-6">Profile Details</h2>
      
      <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-stone-900">Personal Information</h3>
          <button className="text-sm text-stone-500 hover:text-stone-900 underline">Edit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Full Name</label>
            <p className="text-stone-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Email Address</label>
            <p className="text-stone-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Phone Number</label>
            <p className="text-stone-900">{user.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-stone-900">Default Address</h3>
          <button className="text-sm text-stone-500 hover:text-stone-900 underline">Manage Addresses</button>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-stone-400 mt-1" />
          <p className="text-stone-900 max-w-sm leading-relaxed">
            {user.defaultAddress}
          </p>
        </div>
      </div>

       <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-stone-900">Payment Methods</h3>
          <button className="text-sm text-stone-500 hover:text-stone-900 underline">Manage Cards</button>
        </div>
        <div className="flex items-center gap-4 border border-stone-200 rounded-lg p-4 max-w-sm">
          <CreditCard size={24} className="text-stone-800" />
          <div className="flex-1">
             <p className="text-sm font-medium text-stone-900">Visa ending in 4242</p>
             <p className="text-xs text-stone-500">Expires 12/26</p>
          </div>
          <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-600 font-medium">Default</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center text-white text-lg font-serif">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-stone-900">{user.name}</p>
                <p className="text-xs text-stone-500">Member since 2024</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} />
                  <span>My Orders</span>
                </div>
                {activeTab === 'orders' && <ChevronRight size={14} />}
              </button>
              
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span>Profile Info</span>
                </div>
                {activeTab === 'profile' && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>Addresses</span>
                </div>
                {activeTab === 'addresses' && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
                {activeTab === 'settings' && <ChevronRight size={14} />}
              </button>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-stone-100">
               <button 
                 onClick={onLogout} 
                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'addresses' && renderProfile()} {/* Reusing profile for simplicity in this demo */}
          {activeTab === 'settings' && (
             <div className="bg-white border border-stone-200 rounded-xl p-8 text-center py-20">
                <Settings className="mx-auto h-12 w-12 text-stone-300 mb-4" />
                <h3 className="text-lg font-medium text-stone-900">Settings</h3>
                <p className="text-stone-500">Account settings and preferences coming soon.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};