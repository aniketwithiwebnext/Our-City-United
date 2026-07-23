import React, { useState } from 'react';
import { Building2, Search, Heart, User, Shield, Phone, Mail, Menu, X, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  userRole: 'user' | 'owner' | 'admin';
  setUserRole: (role: 'user' | 'owner' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExecuteSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenFavorites,
  userRole,
  setUserRole,
  searchQuery,
  setSearchQuery,
  onExecuteSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'directory', label: 'Directory' },
    { id: 'categories', label: 'Categories' },
    { id: 'events', label: 'Events' },
    { id: 'blog', label: 'News & Blog' },
    { id: 'plans', label: 'Pricing' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B3D91] text-white shadow-md">
      {/* Top Banner Contact Information */}
      <div className="bg-[#072252] px-4 py-1.5 border-b border-blue-900/50 text-xs text-white/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-[#F4B400] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Our City United LLC
            </span>
            <span className="hidden md:inline text-blue-300/40">•</span>
            <span className="flex items-center gap-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#F4B400]" /> Socorro, Texas
            </span>
            <span className="hidden md:inline text-blue-300/40">•</span>
            <a href="tel:9153003190" className="flex items-center gap-1 hover:text-[#F4B400] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#F4B400]" /> (915) 300-3190
            </a>
            <span className="hidden md:inline text-blue-300/40">•</span>
            <a href="mailto:Ourcityunited@gmail.com" className="hidden lg:flex items-center gap-1 hover:text-[#F4B400] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#F4B400]" /> Ourcityunited@gmail.com
            </a>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-blue-200/70 font-medium hidden sm:inline">Role View:</span>
            <div className="bg-[#0B3D91] p-0.5 rounded-lg border border-blue-400/20 flex items-center gap-0.5">
              <button
                onClick={() => {
                  setUserRole('user');
                  setActiveTab('home');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  userRole === 'user' ? 'bg-[#F4B400] text-[#0B3D91] font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                Resident
              </button>
              <button
                onClick={() => {
                  setUserRole('owner');
                  setActiveTab('owner-dashboard');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  userRole === 'owner' ? 'bg-white text-[#0B3D91] font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                Owner Portal
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('admin-dashboard');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  userRole === 'admin' ? 'bg-purple-500 text-white font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => {
            setActiveTab('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#F4B400] rounded-lg flex items-center justify-center font-bold text-[#0B3D91] text-2xl shadow-sm group-hover:scale-105 transition-transform">
            U
          </div>
          <div>
            <span className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight uppercase flex items-center gap-1.5">
              OUR CITY UNITED <span className="text-[#F4B400]">LLC</span>
            </span>
            <span className="block text-[10px] tracking-widest text-blue-200/80 uppercase font-semibold">
              Socorro, TX • Business Directory
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 uppercase text-xs font-semibold tracking-wider">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-md transition-all ${
                activeTab === item.id
                  ? 'bg-white/15 text-[#F4B400] font-bold'
                  : 'text-white/90 hover:text-[#F4B400] hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 rounded-lg bg-blue-900/60 hover:bg-blue-900 border border-blue-400/30 text-white transition-colors"
            title="Saved Favorite Businesses"
          >
            <Heart className="w-5 h-5 text-[#F4B400] fill-[#F4B400]/30" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F4B400] text-[#0B3D91] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Add Listing / Portal Call To Action */}
          <button
            onClick={() => {
              setUserRole('owner');
              setActiveTab('owner-dashboard');
            }}
            className="hidden sm:flex items-center gap-2 bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] font-bold px-4 py-2 rounded-md text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Add Listing
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-blue-900/60 text-white border border-blue-400/30"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#072252] border-b border-blue-900/50 px-4 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-[#F4B400] text-[#0B3D91] font-bold'
                    : 'bg-[#0B3D91] text-white hover:bg-blue-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setUserRole('owner');
                setActiveTab('owner-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#F4B400] text-[#0B3D91] font-bold py-3 rounded-lg text-xs uppercase tracking-wider text-center"
            >
              List Your Business in Socorro
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#0B3D91] text-purple-300 border border-purple-400/30 py-2.5 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <Shield className="w-4 h-4" /> Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
