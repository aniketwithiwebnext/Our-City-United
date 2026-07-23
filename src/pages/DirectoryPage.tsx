import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, MapPin, Star, Phone, Globe, Heart, Sparkles, CheckCircle2, Clock, Map, ExternalLink } from 'lucide-react';
import { BusinessListing, BusinessCategory } from '../types';
import { DirectoryMap } from '../components/DirectoryMap';

interface DirectoryPageProps {
  listings: BusinessListing[];
  categories: BusinessCategory[];
  onSelectListing: (listing: BusinessListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialSearchQuery?: string;
  initialCategory?: string;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  listings,
  categories,
  onSelectListing,
  favorites,
  onToggleFavorite,
  initialSearchQuery = '',
  initialCategory = 'All',
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [zipFilter, setZipFilter] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMapListing, setSelectedMapListing] = useState<BusinessListing | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Search text
      if (search) {
        const q = search.toLowerCase();
        const matchName = listing.name.toLowerCase().includes(q);
        const matchDesc = listing.description.toLowerCase().includes(q);
        const matchCat = listing.category.toLowerCase().includes(q);
        const matchService = listing.services.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchService) return false;
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const matchCategory = listing.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchSub = listing.subcategories.some((s) => s.toLowerCase() === selectedCategory.toLowerCase());
        if (!matchCategory && !matchSub) return false;
      }

      // ZIP filter
      if (zipFilter && !listing.zipCode.includes(zipFilter)) return false;

      // Rating filter
      if (minRating > 0 && listing.rating < minRating) return false;

      // Open now filter
      if (openNowOnly && !listing.isOpenNow) return false;

      return true;
    });
  }, [listings, search, selectedCategory, zipFilter, minRating, openNowOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B3D91] text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <span className="text-[#F4B400] text-xs font-bold uppercase tracking-widest block mb-1">
            Our City United LLC • Socorro Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Socorro Business Directory
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
            Explore verified local shops, services, medical clinics, and dining in Socorro, Texas. Filter by category, ZIP code, or open operating hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMapModal(true)}
            className="bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md uppercase tracking-wider"
          >
            <Map className="w-4 h-4" /> View Map Overview
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Text Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#0B3D91] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business name, keyword, or service..."
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0B3D91] outline-none transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0B3D91] outline-none cursor-pointer"
            >
              <option value="All">All Categories ({listings.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* ZIP Code Filter */}
          <div>
            <input
              type="text"
              value={zipFilter}
              onChange={(e) => setZipFilter(e.target.value)}
              placeholder="ZIP Code (e.g. 79927)"
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0B3D91] outline-none"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full bg-gray-50 text-gray-800 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#0B3D91] outline-none cursor-pointer"
            >
              <option value={0}>Any Star Rating</option>
              <option value={4.5}>4.5★ & above</option>
              <option value={4.0}>4.0★ & above</option>
              <option value={3.5}>3.5★ & above</option>
            </select>
          </div>
        </div>

        {/* Toggle Bar: Open Now & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium select-none">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(e) => setOpenNowOnly(e.target.checked)}
                className="w-4 h-4 accent-[#0B3D91] rounded cursor-pointer"
              />
              <Clock className="w-3.5 h-3.5 text-[#0B3D91]" /> Open Now Only
            </label>

            <span className="text-gray-300">|</span>

            <span className="text-gray-600">
              Showing <strong className="text-[#0B3D91] font-bold">{filteredListings.length}</strong> businesses
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-[#0B3D91] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-[#0B3D91] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-[#0B3D91] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory Listings Grid / List / Map Container */}
      {viewMode === 'map' ? (
        <DirectoryMap
          listings={filteredListings}
          onSelectListing={onSelectListing}
          selectedListing={selectedMapListing}
        />
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <p className="text-gray-800 text-base font-semibold">No local businesses matched your search filters.</p>
          <p className="text-gray-500 text-xs">Try broadening your search term or selecting "All Categories".</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setZipFilter('');
              setMinRating(0);
              setOpenNowOnly(false);
            }}
            className="mt-2 bg-[#0B3D91] text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const isFav = favorites.includes(listing.id);
            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0B3D91] transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Favorite Bookmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(listing.id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 border border-gray-200 text-gray-600 hover:text-[#0B3D91] shadow-sm transition-colors"
                  title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'text-[#F4B400] fill-[#F4B400]' : ''}`} />
                </button>

                <div
                  onClick={() => onSelectListing(listing)}
                  className="relative h-44 overflow-hidden cursor-pointer bg-gray-100"
                >
                  <img
                    src={listing.coverImage}
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {listing.featured && (
                    <span className="absolute top-3 left-3 bg-[#F4B400] text-[#0B3D91] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-sm">
                      ELITE PARTNER
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/75 via-black/40 to-transparent flex items-center gap-2">
                    <img
                      src={listing.logo}
                      alt={listing.name}
                      className="w-9 h-9 rounded-lg object-cover border border-white shadow-sm"
                    />
                    <div className="overflow-hidden">
                      <h3 className="text-white font-bold text-sm font-heading group-hover:text-[#F4B400] transition-colors truncate">
                        {listing.name}
                      </h3>
                      <p className="text-[11px] text-gray-200 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-[#F4B400]" /> {listing.address}, Socorro
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {listing.aiSummary || listing.tagline}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F4B400] fill-[#F4B400]" />
                      <span className="font-bold text-gray-900">{listing.rating}</span>
                      <span className="text-gray-400 text-[11px]">({listing.reviewCount})</span>
                    </div>

                    <a
                      href={`tel:${listing.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] text-[#0B3D91] hover:underline font-semibold"
                    >
                      <Phone className="w-3 h-3" /> {listing.phone}
                    </a>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onSelectListing(listing)}
                      className="flex-1 bg-[#0B3D91] hover:bg-[#072252] text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all text-center shadow-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMapListing(listing);
                        setViewMode('map');
                      }}
                      className="bg-gray-100 hover:bg-[#F4B400] hover:text-[#0B3D91] text-gray-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                      title="View on Map"
                    >
                      <Map className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const isFav = favorites.includes(listing.id);
            return (
              <div
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0B3D91] transition-all flex flex-col sm:flex-row items-center gap-5 cursor-pointer group"
              >
                <img
                  src={listing.coverImage}
                  alt={listing.name}
                  className="w-full sm:w-48 h-32 rounded-xl object-cover shrink-0 bg-gray-100"
                />

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#1A1A1A] font-bold text-base font-heading group-hover:text-[#0B3D91] transition-colors">
                        {listing.name}
                      </h3>
                      {listing.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#0B3D91] shrink-0" title="Verified Listing" />
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(listing.id);
                      }}
                      className="p-1.5 rounded-full text-gray-400 hover:text-[#0B3D91]"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-[#F4B400] fill-[#F4B400]' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{listing.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 pt-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1 text-[#0B3D91] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#F4B400]" /> {listing.address}, Socorro, TX {listing.zipCode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F4B400] fill-[#F4B400]" /> {listing.rating} ({listing.reviewCount} reviews)
                      </span>
                      <span className="flex items-center gap-1 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-[#0B3D91]" /> {listing.phone}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMapListing(listing);
                        setViewMode('map');
                      }}
                      className="bg-blue-50 hover:bg-[#F4B400] text-[#0B3D91] font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <Map className="w-3.5 h-3.5" /> View on Map
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MAP OVERVIEW MODAL */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-5xl p-6 space-y-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-[#1A1A1A] font-bold text-lg font-heading flex items-center gap-2">
                <Map className="w-5 h-5 text-[#0B3D91]" /> Socorro Texas Interactive Google Map
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-800 font-bold text-sm px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕ Close
              </button>
            </div>

            <DirectoryMap
              listings={filteredListings}
              onSelectListing={(b) => {
                onSelectListing(b);
                setShowMapModal(false);
              }}
              selectedListing={selectedMapListing}
            />

            <div className="text-right pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowMapModal(false)}
                className="bg-[#0B3D91] text-white font-bold px-5 py-2 rounded-xl text-xs uppercase"
              >
                Back To Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
