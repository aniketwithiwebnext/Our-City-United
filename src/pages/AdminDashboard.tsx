import React, { useState } from 'react';
import { ShieldCheck, Building2, Plus, Edit, Trash2, Check, Star, Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { BusinessListing, BusinessCategory, LocalEvent, BlogPost } from '../types';

interface AdminDashboardProps {
  listings: BusinessListing[];
  categories: BusinessCategory[];
  events: LocalEvent[];
  blogPosts: BlogPost[];
  onUpdateListings: (listings: BusinessListing[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  listings,
  categories,
  events,
  blogPosts,
  onUpdateListings,
}) => {
  const [adminTab, setAdminTab] = useState<'listings' | 'categories' | 'events' | 'blog'>('listings');

  // New Listing Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCat, setNewBizCat] = useState('Restaurants');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizAddr, setNewBizAddr] = useState('');

  const handleToggleFeatured = (id: string) => {
    const updated = listings.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b));
    onUpdateListings(updated);
  };

  const handleToggleVerified = (id: string) => {
    const updated = listings.map((b) => (b.id === id ? { ...b, verified: !b.verified } : b));
    onUpdateListings(updated);
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const updated = listings.filter((b) => b.id !== id);
      onUpdateListings(updated);
    }
  };

  const handleAddListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName) return;

    const newListing: BusinessListing = {
      id: `biz-${Date.now()}`,
      name: newBizName,
      slug: newBizName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newBizCat,
      subcategories: [newBizCat],
      description: 'Newly added Socorro business directory listing.',
      tagline: 'Serving Socorro, Texas',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'],
      address: newBizAddr || 'Socorro Rd',
      city: 'Socorro',
      state: 'TX',
      zipCode: '79927',
      phone: newBizPhone || '(915) 300-3190',
      email: 'contact@socorro.com',
      website: 'https://ourcityunited.com',
      hours: {
        Monday: '8:00 AM - 5:00 PM',
        Tuesday: '8:00 AM - 5:00 PM',
        Wednesday: '8:00 AM - 5:00 PM',
        Thursday: '8:00 AM - 5:00 PM',
        Friday: '8:00 AM - 5:00 PM',
        Saturday: 'Closed',
        Sunday: 'Closed',
      },
      lat: 31.6582,
      lng: -106.2917,
      rating: 5.0,
      reviewCount: 1,
      claimed: true,
      verified: true,
      featured: false,
      isOpenNow: true,
      socialLinks: {},
      services: ['Customer Service', 'Local Delivery'],
      plan: 'free',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateListings([newListing, ...listings]);
    setShowAddModal(false);
    setNewBizName('');
    setNewBizPhone('');
    setNewBizAddr('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
              Our City United LLC • Site Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Directory Manager & Moderator
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Business
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setAdminTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'listings'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Listings ({listings.length})
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'categories'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Categories ({categories.length})
        </button>

        <button
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'events'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Events ({events.length})
        </button>

        <button
          onClick={() => setAdminTab('blog')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'blog'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Blog & News ({blogPosts.length})
        </button>
      </div>

      {/* Listings Admin Table */}
      {adminTab === 'listings' && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-xs text-white">
            Socorro Business Directory Records
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-amber-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Business</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <img src={listing.logo} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div>{listing.name}</div>
                        <div className="text-[10px] text-slate-400">{listing.phone}</div>
                      </div>
                    </td>
                    <td className="p-3.5">{listing.category}</td>
                    <td className="p-3.5">
                      <span className="uppercase font-bold text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {listing.plan}
                      </span>
                    </td>
                    <td className="p-3.5 space-x-1">
                      <button
                        onClick={() => handleToggleVerified(listing.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          listing.verified
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {listing.verified ? 'Verified' : 'Unverified'}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(listing.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          listing.featured
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {listing.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        className="p-1.5 rounded bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-800"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-sm text-white">{c.name}</h4>
              <p className="text-xs text-slate-400">{c.description}</p>
              <span className="text-[10px] text-amber-400 font-bold">{c.count} active listings</span>
            </div>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {adminTab === 'events' && (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">{e.title}</h4>
                <p className="text-slate-400">{e.date} • {e.location}</p>
              </div>
              <span className="bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                {e.category}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Blog Tab */}
      {adminTab === 'blog' && (
        <div className="space-y-3">
          {blogPosts.map((p) => (
            <div key={p.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                <p className="text-slate-400">By {p.author} on {p.date}</p>
              </div>
              <span className="bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                {p.category}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg font-heading">
              Add New Socorro Business Listing
            </h3>

            <form onSubmit={handleAddListingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Business Name</label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  required
                  placeholder="e.g. Lower Valley Electric"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  value={newBizCat}
                  onChange={(e) => setNewBizCat(e.target.value)}
                  className="w-full bg-slate-950 text-amber-400 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newBizPhone}
                  onChange={(e) => setNewBizPhone(e.target.value)}
                  placeholder="(915) 300-3190"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Address in Socorro</label>
                <input
                  type="text"
                  value={newBizAddr}
                  onChange={(e) => setNewBizAddr(e.target.value)}
                  placeholder="10200 Socorro Rd"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl uppercase tracking-wider"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
