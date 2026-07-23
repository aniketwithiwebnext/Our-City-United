import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatbotWidget } from './components/AIChatbotWidget';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { EventsPage } from './pages/EventsPage';
import { MembershipsPage } from './pages/MembershipsPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { INITIAL_LISTINGS, INITIAL_CATEGORIES, INITIAL_EVENTS, INITIAL_BLOG_POSTS } from './data/mockData';
import { BusinessListing, BusinessCategory, LocalEvent, BlogPost, CustomerInquiry, Review } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<'user' | 'owner' | 'admin'>('user');

  // Core Data Collections
  const [listings, setListings] = useState<BusinessListing[]>(INITIAL_LISTINGS);
  const [categories, setCategories] = useState<BusinessCategory[]>(INITIAL_CATEGORIES);
  const [events, setEvents] = useState<LocalEvent[]>(INITIAL_EVENTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Selected Listing for Profile Page
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null);

  // Search state across pages
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ocu_favorites');
      return saved ? JSON.parse(saved) : ['biz-1', 'biz-3'];
    } catch {
      return ['biz-1', 'biz-3'];
    }
  });

  // Save favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ocu_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Fetch initial API data from server.ts if running full-stack
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const resListings = await fetch('/api/listings');
        if (resListings.ok) {
          const data = await resListings.json();
          if (Array.isArray(data) && data.length > 0) {
            setListings(data);
          }
        }

        const resInquiries = await fetch('/api/inquiries');
        if (resInquiries.ok) {
          const inqData = await resInquiries.json();
          setInquiries(inqData);
        }

        const resReviews = await fetch('/api/reviews');
        if (resReviews.ok) {
          const revData = await resReviews.json();
          setReviews(revData);
        }
      } catch (err) {
        console.log('Using pre-populated client dataset:', err);
      }
    };
    fetchApiData();
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectListing = (listing: BusinessListing) => {
    setSelectedListing(listing);
    setActiveTab('business-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTrigger = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setActiveTab('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateListing = (updated: BusinessListing) => {
    setListings((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    if (selectedListing?.id === updated.id) {
      setSelectedListing(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#F4B400] selection:text-[#0B3D91]">
      
      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          setActiveTab('directory');
          setSearchQuery('');
          setSelectedCategory('All');
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExecuteSearch={() => handleSearchTrigger(searchQuery, selectedCategory)}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            listings={listings}
            categories={categories}
            events={events}
            blogPosts={blogPosts}
            onSelectListing={handleSelectListing}
            setActiveTab={setActiveTab}
            onSearch={handleSearchTrigger}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryPage
            listings={listings}
            categories={categories}
            onSelectListing={handleSelectListing}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            initialSearchQuery={searchQuery}
            initialCategory={selectedCategory}
          />
        )}

        {activeTab === 'business-profile' && selectedListing && (
          <BusinessProfilePage
            listing={selectedListing}
            onBack={() => setActiveTab('directory')}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            categories={categories}
            onSelectCategory={(catName) => {
              handleSearchTrigger('', catName);
            }}
          />
        )}

        {activeTab === 'events' && <EventsPage events={events} />}

        {activeTab === 'blog' && <BlogPage posts={blogPosts} />}

        {activeTab === 'plans' && (
          <MembershipsPage
            onSelectPlan={(planId) => {
              setUserRole('owner');
              setActiveTab('owner-dashboard');
            }}
          />
        )}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'contact' && <ContactPage />}

        {activeTab === 'owner-dashboard' && (
          <OwnerDashboard
            listings={listings}
            onUpdateListing={handleUpdateListing}
            inquiries={inquiries}
            reviews={reviews}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            listings={listings}
            categories={categories}
            events={events}
            blogPosts={blogPosts}
            onUpdateListings={setListings}
          />
        )}
      </main>

      {/* Persistent AI Chatbot Floating Widget */}
      <AIChatbotWidget />

      {/* Persistent Floating Scroll-To-Top Button */}
      <ScrollToTop />

      {/* Persistent Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
