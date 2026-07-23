import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Star, Clock, CheckCircle2, Shield, Share2, Heart, MessageSquare, Sparkles, Send, Facebook, Twitter, ArrowLeft, Camera, ExternalLink } from 'lucide-react';
import { BusinessListing, Review } from '../types';

interface BusinessProfilePageProps {
  listing: BusinessListing;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const BusinessProfilePage: React.FC<BusinessProfilePageProps> = ({
  listing,
  onBack,
  favorites,
  onToggleFavorite,
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: 'rev-sample-1',
      businessId: listing.id,
      userName: 'Socorro Resident',
      rating: 5,
      date: '2026-03-10',
      comment: 'Excellent service in Socorro! Staff was extremely welcoming and professional.',
    },
  ]);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewer, setNewReviewer] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Inquiry form state
  const [inqName, setInqName] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMsg, setInqMsg] = useState('');
  const [inqSent, setInqSent] = useState(false);

  // Claim modal state
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  const isFav = favorites.includes(listing.id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer || !newComment) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: listing.id,
          userName: newReviewer,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      setReviewsList([data, ...reviewsList]);
    } catch (err) {
      // Fallback local add
      const fallbackRev: Review = {
        id: `rev-${Date.now()}`,
        businessId: listing.id,
        userName: newReviewer,
        rating: newRating,
        date: new Date().toISOString().split('T')[0],
        comment: newComment,
      };
      setReviewsList([fallbackRev, ...reviewsList]);
    } finally {
      setShowReviewModal(false);
      setNewReviewer('');
      setNewComment('');
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqEmail || !inqMsg) return;

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: listing.id,
          businessName: listing.name,
          senderName: inqName,
          senderEmail: inqEmail,
          senderPhone: inqPhone,
          message: inqMsg,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setInqSent(true);
      setInqName('');
      setInqEmail('');
      setInqPhone('');
      setInqMsg('');
      setTimeout(() => setInqSent(false), 6000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.name,
        text: `Check out ${listing.name} in Socorro, TX on Our City United LLC Directory!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Business page link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Back Button & Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFav
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-amber-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-slate-950' : ''}`} />
            {isFav ? 'Saved' : 'Save Favorite'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-slate-900 text-slate-300 hover:text-white border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Hero Cover Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
        <div className="h-64 sm:h-80 relative">
          <img
            src={listing.coverImage}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Floating Profile Info Over Cover */}
        <div className="p-6 sm:p-8 relative z-10 -mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <img
              src={listing.logo}
              alt={`${listing.name} logo`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {listing.category}
                </span>
                {listing.verified && (
                  <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-800/50 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Listing
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                {listing.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" /> {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${listing.phone}`}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
            >
              <Phone className="w-4 h-4" /> Call {listing.phone}
            </a>

            {!listing.claimed && (
              <button
                onClick={() => setClaimedSuccess(true)}
                className="bg-blue-900/80 hover:bg-blue-800 text-amber-300 border border-amber-500/30 font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Claim This Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {claimedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center justify-between">
          <span>Claim request submitted! Our City United LLC will verify ownership via phone <strong>(915) 300-3190</strong>.</span>
          <button onClick={() => setClaimedSuccess(false)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Main Profile Grid: Left Info & Right Contact Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Bio, Gallery, Services, Reviews */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Executive Summary Badge */}
          {listing.aiSummary && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 to-amber-950/80 border border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-heading">
                  AI Summary & Spotlight
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {listing.aiSummary}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white font-heading">About {listing.name}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Photo Gallery */}
          {listing.photos && listing.photos.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" /> Photo Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {listing.photos.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${listing.name} photo ${i + 1}`}
                    className="w-full h-40 rounded-2xl object-cover border border-slate-800 hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Services Offered */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading">Services & Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {listing.services.map((service, i) => (
                <span
                  key={i}
                  className="bg-slate-900 text-slate-200 border border-slate-700/80 text-xs font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> {service}
                </span>
              ))}
            </div>
          </div>

          {/* Products List if available */}
          {listing.products && listing.products.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading">Featured Products / Menu Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.products.map((prod, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{prod.name}</h4>
                      <span className="text-[11px] text-amber-400 font-bold">{prod.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  Customer Reviews ({reviewsList.length})
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">{listing.rating} out of 5</span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{rev.userName}</span>
                    <span className="text-slate-500">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Hours, Contact Form, Map */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Operating Hours Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Business Hours
            </h3>
            <div className="space-y-2 text-xs divide-y divide-slate-800/60">
              {Object.entries(listing.hours).map(([day, time]) => (
                <div key={day} className="pt-2 flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">{day}</span>
                  <span className="font-medium text-white">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info & Website */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-base font-bold text-white font-heading">Contact Details</h3>
            
            <div className="space-y-2.5 text-slate-300 pt-1">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{listing.address}, Socorro, TX {listing.zipCode}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${listing.phone}`} className="hover:text-amber-400 font-semibold">
                  {listing.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${listing.email}`} className="hover:text-amber-400">
                  {listing.email}
                </a>
              </div>
              {listing.website && (
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Google Maps Location Container */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" /> Socorro Map View
            </h3>
            <div className="w-full h-48 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center space-y-2">
              <MapPin className="w-8 h-8 text-amber-400 animate-bounce" />
              <span className="text-xs font-bold text-white">{listing.address}</span>
              <span className="text-[10px] text-slate-400">Latitude {listing.lat}, Longitude {listing.lng}</span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(listing.name + ' ' + listing.address + ' Socorro TX')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                Open Google Maps Directions
              </a>
            </div>
          </div>

          {/* Direct Message / Contact Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" /> Send Direct Inquiry
            </h3>

            {inqSent && (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl border border-emerald-800">
                Inquiry delivered to {listing.name}!
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <input
                type="text"
                value={inqName}
                onChange={(e) => setInqName(e.target.value)}
                placeholder="Your Full Name"
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
              <input
                type="email"
                value={inqEmail}
                onChange={(e) => setInqEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
              <input
                type="tel"
                value={inqPhone}
                onChange={(e) => setInqPhone(e.target.value)}
                placeholder="Phone Number (Optional)"
                className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
              <textarea
                value={inqMsg}
                onChange={(e) => setInqMsg(e.target.value)}
                placeholder="How can this business help you?"
                rows={3}
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg font-heading">
              Write a Review for {listing.name}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  placeholder="e.g. Maria Socorro"
                  required
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Star Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-slate-950 text-amber-400 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                >
                  <option value={5}>5★ - Excellent</option>
                  <option value={4}>4★ - Very Good</option>
                  <option value={3}>3★ - Average</option>
                  <option value={2}>2★ - Poor</option>
                  <option value={1}>1★ - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Your Review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl uppercase tracking-wider"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
