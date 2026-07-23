import React, { useState } from 'react';
import { Building2, Phone, Mail, MapPin, Send, Facebook, Instagram, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#0B3D91] text-white/80 border-t border-white/10 py-12 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 bg-[#F4B400] rounded-lg flex items-center justify-center font-bold text-[#0B3D91] text-2xl shadow-sm">
                U
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight uppercase">
                OUR CITY UNITED <span className="text-[#F4B400]">LLC</span>
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Empowering local businesses, connecting residents, and fostering economic prosperity across Socorro, Texas and the Lower Valley.
            </p>

            <div className="space-y-2 pt-1 text-xs text-white/80">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F4B400] shrink-0" />
                <span>Socorro, Texas</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F4B400] shrink-0" />
                <a href="tel:9153003190" className="hover:text-[#F4B400] transition-colors">
                  (915) 300-3190
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F4B400] shrink-0" />
                <a href="mailto:Ourcityunited@gmail.com" className="hover:text-[#F4B400] transition-colors">
                  Ourcityunited@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F4B400] hover:text-[#0B3D91] flex items-center justify-center transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F4B400] hover:text-[#0B3D91] flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F4B400] hover:text-[#0B3D91] flex items-center justify-center transition-colors text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F4B400] hover:text-[#0B3D91] flex items-center justify-center transition-colors text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Directory Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs font-heading uppercase tracking-wider text-[#F4B400]">
              Directory
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <button onClick={() => setActiveTab('directory')} className="hover:text-[#F4B400] transition-colors">
                  All Socorro Listings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-[#F4B400] transition-colors">
                  Browse Categories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-[#F4B400] transition-colors">
                  Local Events Calendar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#F4B400] transition-colors">
                  News & Business Tips
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('plans')} className="hover:text-[#F4B400] transition-colors">
                  Membership Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs font-heading uppercase tracking-wider text-[#F4B400]">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#F4B400] transition-colors">
                  About Our City United
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#F4B400] transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#F4B400] transition-colors">
                  Economic Development
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('plans')} className="hover:text-[#F4B400] transition-colors">
                  List Your Business
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Our City United LLC respects your data privacy.'); }} className="hover:text-[#F4B400] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs font-heading uppercase tracking-wider text-[#F4B400]">
              Community Newsletter
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Subscribe to receive local Socorro news and featured small businesses.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-white/10 border border-white/20 focus:border-[#F4B400] rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/50 outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-md uppercase tracking-wider"
              >
                <Send className="w-3 h-3" /> Subscribe
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-[#F4B400] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Attribution & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/70 gap-3">
          <div className="text-left space-y-0.5">
            <p className="font-bold text-white uppercase tracking-wider">Our City United LLC • Socorro, TX</p>
            <p>Phone: (915) 300-3190 | Email: Ourcityunited@gmail.com</p>
            <p>© {new Date().getFullYear()} Our City United. Built for the community of Socorro.</p>
          </div>
          <div className="text-center sm:text-right font-medium text-white/90">
            Developed by <a href="https://iwebnext.com" target="_blank" rel="noopener noreferrer" className="text-[#F4B400] hover:underline font-bold">iWebNext</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
