import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, User, ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPageProps {
  posts: BlogPost[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPosts = posts.filter(
    (p) => categoryFilter === 'All' || p.category === categoryFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {!selectedPost ? (
        <>
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-8 rounded-3xl border border-amber-500/20 shadow-xl space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Our City United LLC • Socorro Insights
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Local Business News & Community Updates
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Stay informed on local economic development, small business growth strategies, events, and community stories across Socorro, Texas.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Local News', 'Community Updates', 'Business Tips', 'Economic Development'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>Read Article</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Single Post Reader */
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News
          </button>

          <article className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30">
              {selectedPost.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              {selectedPost.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" /> {selectedPost.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> {selectedPost.date}
              </span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-80 rounded-2xl object-cover border border-slate-800"
            />

            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {selectedPost.content}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
