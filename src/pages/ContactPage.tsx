import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-8 rounded-3xl border border-amber-500/20 text-center max-w-3xl mx-auto space-y-2">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          Contact Our City United LLC
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Have questions about directory listings, membership plans, or local events in Socorro, Texas? We’re here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading">Send Us a Message</h2>

          {submitted && (
            <div className="p-4 bg-emerald-950 text-emerald-300 text-xs rounded-2xl border border-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Thank you for reaching out! Our team in Socorro will reply shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(915) 555-0192"
                className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Inquiry</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can Our City United LLC assist you?"
                rows={5}
                required
                className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Right Column: Contact Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white font-heading">Our City United LLC</h2>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="block text-white">Location</strong>
                  <span>Socorro, Texas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="block text-white">Phone</strong>
                  <a href="tel:9153003190" className="hover:text-amber-400 font-semibold">
                    (915) 300-3190
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="block text-white">Email</strong>
                  <a href="mailto:Ourcityunited@gmail.com" className="hover:text-amber-400">
                    Ourcityunited@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="block text-white">Business Hours</strong>
                  <span>Monday – Friday: 8:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Socorro, Texas Headquarters Map
            </h3>
            <div className="w-full h-48 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center space-y-2">
              <MapPin className="w-8 h-8 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Our City United LLC</span>
              <span className="text-[10px] text-slate-400">Socorro, TX 79927</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
