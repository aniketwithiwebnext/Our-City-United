import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Building2, Star, ArrowRight, ShieldCheck, Users, TrendingUp, CheckCircle, Award, Calendar, Newspaper, Phone } from 'lucide-react';
import { BusinessListing, BusinessCategory, LocalEvent, BlogPost } from '../types';

interface HomePageProps {
  listings: BusinessListing[];
  categories: BusinessCategory[];
  events: LocalEvent[];
  blogPosts: BlogPost[];
  onSelectListing: (listing: BusinessListing) => void;
  setActiveTab: (tab: string) => void;
  onSearch: (query: string, category: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  listings,
  categories,
  events,
  blogPosts,
  onSelectListing,
  setActiveTab,
  onSearch,
  favorites,
  onToggleFavorite,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const featuredListings = listings.filter((l) => l.featured);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      onSearch('', selectedCategory);
      setActiveTab('directory');
      return;
    }

    setAiSearching(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchInput }),
      });
      const data = await res.json();
      setAiExplanation(data.aiExplanation);
      onSearch(searchInput, selectedCategory);
      setActiveTab('directory');
    } catch (err) {
      onSearch(searchInput, selectedCategory);
      setActiveTab('directory');
    } finally {
      setAiSearching(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION WITH AI SEARCH */}
      <section className="relative pt-8 pb-14 overflow-hidden bg-gradient-to-br from-[#0B3D91] via-[#072252] to-[#0B3D91] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto space-y-6 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4B400] text-[#0B3D91] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Official Business Directory • Socorro, TX
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading tracking-tight leading-[1.15]">
              Discover & Support <br />
              <span className="text-[#F4B400]">
                Local Socorro
              </span>{' '}
              Businesses
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
              Connecting residents with trusted local shops, restaurants, medical clinics, contractors, and services across Socorro, Texas. Proudly presented by <strong className="text-white font-semibold">Our City United LLC</strong>.
            </p>

            {/* AI Natural Language Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 rounded-2xl shadow-xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 w-full max-w-2xl border border-gray-200 text-left"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <Search className="w-5 h-5 text-[#0B3D91] shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder='Try "Cozy Mexican bakery" or "Auto repair open now"'
                  className="w-full bg-transparent text-gray-900 placeholder-gray-500 text-xs sm:text-sm outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.slice(0, 8).map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={aiSearching}
                  className="bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow shrink-0"
                >
                  {aiSearching ? (
                    <span>Searching...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Search
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Stat Badges */}
            <div className="pt-3 grid grid-cols-3 gap-4 border-t border-white/10 w-full max-w-xl text-white text-center">
              <div>
                <span className="block text-xl font-bold font-heading">350+</span>
                <span className="text-[11px] text-white/70">Socorro Businesses</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-[#F4B400] font-heading">100%</span>
                <span className="text-[11px] text-white/70">Verified Local</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-heading">12,000+</span>
                <span className="text-[11px] text-white/70">Monthly Searches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-[#0B3D91] text-xs font-bold uppercase tracking-widest block mb-1">
              Explore By Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-heading">
              Popular Local Business Categories
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-[#0B3D91] hover:text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            View All 18 Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 12).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSearch('', cat.name);
                setActiveTab('directory');
              }}
              className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-1 hover:border-[#0B3D91] hover:shadow-md transition-all cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-[#0B3D91] group-hover:text-white flex items-center justify-center text-[#0B3D91] transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-[#1A1A1A] group-hover:text-[#0B3D91] transition-colors line-clamp-1 font-heading uppercase tracking-wide">
                {cat.name}
              </h3>
              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {cat.count} listings
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BUSINESSES CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-[#0B3D91] text-xs font-bold uppercase tracking-widest block mb-1">
              Handpicked Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-heading">
              Featured Socorro Businesses
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('directory')}
            className="text-[#0B3D91] hover:text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            Browse Full Directory <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg hover:border-[#0B3D91] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={listing.coverImage}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <span className="absolute top-2.5 right-2.5 bg-[#F4B400] text-[#0B3D91] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                  ELITE PARTNER
                </span>

                <div className="absolute bottom-0 left-0 w-full p-2.5 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-2">
                  <img
                    src={listing.logo}
                    alt={`${listing.name} logo`}
                    className="w-9 h-9 rounded-lg object-cover border border-white shadow"
                  />
                  <div>
                    <h3 className="text-white font-bold text-sm font-heading line-clamp-1">
                      {listing.name}
                    </h3>
                    <p className="text-[11px] text-gray-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F4B400]" /> {listing.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {listing.tagline || listing.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[#F4B400] text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F4B400]" />
                    <span className="text-gray-900 font-bold">{listing.rating}</span>
                    <span className="text-gray-400 font-normal text-[11px]">({listing.reviewCount})</span>
                  </div>
                  <span className="text-[#0B3D91] text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {listing.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS OF JOINING OUR CITY UNITED LLC */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-[#0B3D91] text-xs font-bold uppercase tracking-widest">
              Grow Your Business With Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-heading">
              Why Join Our City United LLC?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We empower small businesses in Socorro with priority search rankings, customer inquiry lead capture, review management, and growth tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0B3D91]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-heading">Local Search Dominance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rank at the top when Socorro residents search for your services online. Higher visibility means more phone calls and foot traffic.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0B3D91]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-heading">Community Trust & Reviews</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Build social proof through authentic customer reviews and ratings. Respond directly to feedback to foster customer loyalty.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0B3D91]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-heading">AI Lead Generation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our AI assistant recommends your business to users seeking your specific products and captures instant contact inquiries.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab('plans')}
              className="bg-[#0B3D91] hover:bg-[#072252] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Explore Membership Plans
            </button>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-[#0B3D91] text-xs font-bold uppercase tracking-widest block mb-1">
              Community Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-heading">
              Upcoming Events in Socorro
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-[#0B3D91] hover:text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            View Full Calendar <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setActiveTab('events')}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0B3D91] transition-all cursor-pointer group"
            >
              <div className="h-40 overflow-hidden relative bg-gray-100">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#0B3D91] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {evt.category}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#0B3D91] font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B400]" /> {evt.date} • {evt.time}
                </div>
                <h3 className="text-[#1A1A1A] font-bold text-sm font-heading group-hover:text-[#0B3D91] transition-colors line-clamp-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG / NEWS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-[#0B3D91] text-xs font-bold uppercase tracking-widest block mb-1">
              Local Updates
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-heading">
              Socorro Business News & Tips
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('blog')}
            className="text-[#0B3D91] hover:text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            Read All Articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveTab('blog')}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 cursor-pointer hover:border-[#0B3D91] hover:shadow-md transition-all"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full sm:w-40 h-32 rounded-xl object-cover shrink-0 bg-gray-100"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#0B3D91] tracking-wider">
                  {post.category} • {post.readTime}
                </span>
                <h3 className="text-[#1A1A1A] font-bold text-sm font-heading hover:text-[#0B3D91] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B3D91] text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Ready to Expand Your Local Reach in Socorro?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Claim your business profile today on Our City United LLC or contact our local team in Socorro, TX at <strong className="text-white font-semibold">(915) 300-3190</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('plans')}
                className="w-full sm:w-auto bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Add Your Business Now
              </button>
              <a
                href="tel:9153003190"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#F4B400]" /> Call (915) 300-3190
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
