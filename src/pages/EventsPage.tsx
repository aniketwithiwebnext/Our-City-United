import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Tag, CheckCircle2 } from 'lucide-react';
import { LocalEvent } from '../types';

interface EventsPageProps {
  events: LocalEvent[];
}

export const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rsvpModalEvent, setRsvpModalEvent] = useState<LocalEvent | null>(null);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');

  const filteredEvents = events.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (attendeeName && attendeeEmail) {
      setRsvpConfirmed(true);
      setTimeout(() => {
        setRsvpConfirmed(false);
        setRsvpModalEvent(null);
        setAttendeeName('');
        setAttendeeEmail('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-8 rounded-3xl border border-amber-500/20 shadow-xl space-y-2">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
          Our City United LLC • Community Calendar
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          Socorro Events & Gatherings
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          Discover business expos, networking events, local festivals, and cultural gatherings across Socorro, Texas.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Community', 'Networking', 'Expo', 'Festival'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-extrabold'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
                {event.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-slate-950/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                {event.price}
              </span>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <Calendar className="w-3.5 h-3.5" /> {event.date} • {event.time}
                </div>

                <h3 className="text-lg font-bold text-white font-heading line-clamp-1">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Hosted by {event.organizer}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRsvpModalEvent(event)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
              >
                RSVP / Attend Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RSVP Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg font-heading">
              RSVP for {rsvpModalEvent.title}
            </h3>

            {rsvpConfirmed ? (
              <div className="p-4 bg-emerald-950 text-emerald-300 text-xs rounded-2xl border border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>RSVP confirmed! Event confirmation sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleRSVP} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="Email for calendar invite"
                    required
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Confirm Attendance
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
