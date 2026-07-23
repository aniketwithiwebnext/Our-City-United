import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { BusinessCategory } from '../types';

interface CategoriesPageProps {
  categories: BusinessCategory[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
          Explore Socorro Texas
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          All Business Categories
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
          Browse 18 local business sectors serving Socorro, Texas. From authentic restaurants and auto repair to healthcare and legal counsel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 group-hover:bg-amber-500 group-hover:text-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                {cat.count} listings
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-heading group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {cat.description}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              Browse {cat.name} <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
