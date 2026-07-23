import React from 'react';
import { Building2, Heart, Users, Target, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-8 sm:p-12 rounded-3xl border border-amber-500/20 shadow-2xl text-center max-w-4xl mx-auto space-y-4">
        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
          Our City United LLC • Socorro, Texas
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Empowering Small Businesses, Uniting Our City
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Founded in Socorro, Texas, Our City United LLC serves as the digital backbone and community advocate for local entrepreneurs, family shops, and service providers across the Lower Valley.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To provide every local business in Socorro, Texas with high-visibility digital tools, AI-powered customer discovery, and community support — while offering residents an easy, reliable way to discover trusted local services.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A thriving, self-sustaining local economy where small business owners prosper, dollars circulate within Socorro, and community bonds remain strong for generations to come.
          </p>
        </div>
      </div>

      {/* History & Community Involvement */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
          History of Our City United LLC
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Socorro, Texas has a rich cultural heritage stretching along the historic Mission Trail. As our city grew, local entrepreneurs recognized the need for a dedicated, unified business platform that keeps commercial activity grounded in our community.
          </p>
          <p>
            Established as Our City United LLC, our organization bridges the gap between traditional word-of-mouth recommendations and modern digital marketing. We organize seasonal small business expos, host networking breakfasts, publish community news, and offer digital listing dashboards for owners.
          </p>
        </div>

        {/* Contact Strip */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400" /> Socorro, Texas
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400" /> (915) 300-3190
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-amber-400" /> Ourcityunited@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};
