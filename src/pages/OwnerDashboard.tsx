import React, { useState } from 'react';
import { Building2, Edit3, Image, Clock, MessageSquare, TrendingUp, Sparkles, CheckCircle2, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { BusinessListing, CustomerInquiry, Review } from '../types';

interface OwnerDashboardProps {
  listings: BusinessListing[];
  onUpdateListing: (updated: BusinessListing) => void;
  inquiries: CustomerInquiry[];
  reviews: Review[];
  setActiveTab: (tab: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  listings,
  onUpdateListing,
  inquiries,
  reviews,
  setActiveTab,
}) => {
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'inquiries' | 'reviews' | 'analytics'>('profile');

  const currentListing = listings.find((b) => b.id === selectedListingId) || listings[0];

  // Profile Form state
  const [name, setName] = useState(currentListing?.name || '');
  const [tagline, setTagline] = useState(currentListing?.tagline || '');
  const [description, setDescription] = useState(currentListing?.description || '');
  const [phone, setPhone] = useState(currentListing?.phone || '');
  const [email, setEmail] = useState(currentListing?.email || '');
  const [website, setWebsite] = useState(currentListing?.website || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Review reply state
  const [replyText, setReplyText] = useState('');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentListing) return;

    const updated: BusinessListing = {
      ...currentListing,
      name,
      tagline,
      description,
      phone,
      email,
      website,
    };

    onUpdateListing(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSendReply = (reviewId: string) => {
    if (!replyText) return;
    alert(`Reply posted to review!`);
    setReplyingReviewId(null);
    setReplyText('');
  };

  const myInquiries = inquiries.filter((i) => i.businessId === currentListing?.id || !i.businessId);
  const myReviews = reviews.filter((r) => r.businessId === currentListing?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Business Owner Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            {currentListing?.name || 'Owner Dashboard'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Manage your Socorro directory listing, respond to customer leads, and track monthly analytics.
          </p>
        </div>

        {/* Listing Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedListingId}
            onChange={(e) => {
              setSelectedListingId(e.target.value);
              const b = listings.find((x) => x.id === e.target.value);
              if (b) {
                setName(b.name);
                setTagline(b.tagline);
                setDescription(b.description);
                setPhone(b.phone);
                setEmail(b.email);
                setWebsite(b.website);
              }
            }}
            className="bg-slate-950 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-500/30 outline-none cursor-pointer"
          >
            {listings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.plan.toUpperCase()} Plan)
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab('plans')}
            className="bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'profile'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>

        <button
          onClick={() => setActiveSubTab('inquiries')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
            activeSubTab === 'inquiries'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" /> Customer Inquiries
          {myInquiries.length > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              {myInquiries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'reviews'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Customer Reviews
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Analytics & Views
        </button>
      </div>

      {/* Sub-Tab 1: Profile Editor */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white font-heading">
              Edit Business Listing Information
            </h2>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Changes Saved Successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Business Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
            >
              Save Listing Profile
            </button>
          </div>
        </form>
      )}

      {/* Sub-Tab 2: Inquiries */}
      {activeSubTab === 'inquiries' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white font-heading">Direct Customer Leads</h2>
          {myInquiries.length === 0 ? (
            <p className="text-xs text-slate-400">No customer inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {myInquiries.map((inq) => (
                <div key={inq.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{inq.senderName} ({inq.senderEmail})</span>
                    <span className="text-slate-500">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Reviews */}
      {activeSubTab === 'reviews' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white font-heading">Manage Reviews</h2>
          {myReviews.length === 0 ? (
            <p className="text-xs text-slate-400">No reviews posted yet.</p>
          ) : (
            <div className="space-y-4">
              {myReviews.map((rev) => (
                <div key={rev.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{rev.userName} • {rev.rating}★</span>
                    <span className="text-slate-500">{rev.date}</span>
                  </div>
                  <p className="text-xs text-slate-300">{rev.comment}</p>

                  <button
                    onClick={() => setReplyingReviewId(rev.id)}
                    className="text-[11px] font-bold text-amber-400 hover:underline"
                  >
                    Reply as Owner
                  </button>

                  {replyingReviewId === rev.id && (
                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official owner reply..."
                        className="flex-1 bg-slate-950 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-800"
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 4: Analytics */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Monthly Page Views</span>
            <span className="block text-3xl font-extrabold text-white font-heading">1,420</span>
            <span className="text-[11px] text-emerald-400">+18% vs last month</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Phone Call Clicks</span>
            <span className="block text-3xl font-extrabold text-amber-400 font-heading">284</span>
            <span className="text-[11px] text-emerald-400">+22% vs last month</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Customer Inquiries</span>
            <span className="block text-3xl font-extrabold text-white font-heading">{myInquiries.length + 12}</span>
            <span className="text-[11px] text-emerald-400">High Conversion Rate</span>
          </div>
        </div>
      )}
    </div>
  );
};
