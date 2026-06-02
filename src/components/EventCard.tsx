import React from 'react';
import { Event } from '../types';
import { getCategoryStyle } from '../data';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  onSelect: () => void;
}

export default function EventCard({ event, isSelected, onSelect }: EventCardProps) {
  const catStyle = getCategoryStyle(event.category);
  const goingRSVPs = event.rsvps.filter(r => r.rsvpStatus === 'Going').length;
  const isFull = goingRSVPs >= event.capacity;
  
  // Calculate Event Status relative to 2026-06-02
  const todayStr = '2026-06-02';
  
  const getEventStatus = (): { label: string; bg: string; text: string } => {
    if (event.date < todayStr) {
      return { label: 'Completed', bg: 'bg-white/5 border border-white/5', text: 'text-zinc-500' };
    } else if (event.date === todayStr) {
      return { label: 'Live Today', bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400 font-medium' };
    } else if (isFull) {
      return { label: 'Sold Out', bg: 'bg-rose-500/10 border border-rose-500/20', text: 'text-rose-400' };
    } else {
      return { label: 'Upcoming', bg: 'bg-[#C5A059]/10 border border-[#C5A059]/20', text: 'text-[#C5A059]' };
    }
  };

  const status = getEventStatus();
  const progressPercent = Math.min((goingRSVPs / event.capacity) * 100, 100);

  return (
    <div 
      onClick={onSelect}
      className={`group cursor-pointer bg-[#141416] border ${isSelected ? 'border-[#C5A059] ring-2 ring-[#C5A059]/10' : 'border-white/10 hover:border-white/25'} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full hover:scale-[1.01]`}
    >
      {/* Banner Cover */}
      <div className="h-44 w-full overflow-hidden relative bg-zinc-900 border-b border-white/5">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Category & Status Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/60 shadow-xs border ${catStyle.border} ${catStyle.color}`}>
            {event.category}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/60 shadow-xs border ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Capacity overlay for visual impact */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-zinc-300 border border-white/10 font-medium flex items-center space-x-1">
          <Users className="w-3 h-3 text-[#C5A059]" />
          <span>{goingRSVPs} / {event.capacity}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Calendar Line */}
          <div className="flex items-center space-x-1.5 text-xs text-zinc-500 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{event.date}</span>
            <span>&bull;</span>
            <span>{event.time || 'All Day'}</span>
          </div>

          {/* Title */}
          <h4 className="text-base font-serif italic font-semibold text-white tracking-tight group-hover:text-[#C5A059] transition-colors duration-300 line-clamp-1">
            {event.title}
          </h4>

          {/* Description Snippet */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Card Footer: Spot availability and action */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[9px] mb-1 font-mono text-zinc-500 uppercase tracking-widest">
              <span>Roster Tracker</span>
              <span className={progressPercent >= 90 ? 'text-rose-400 font-bold' : ''}>
                {isFull ? 'fully booked' : `${event.capacity - goingRSVPs} slots unoccupied`}
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-rose-500' : progressPercent >= 80 ? 'bg-amber-500' : 'bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.3)]'}`} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Location Line */}
          <div className="flex items-center space-x-1 text-xs text-zinc-400 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C5A059]/70" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Quick interactive indicators: attendees face counts */}
          {event.rsvps.length > 0 && (
            <div className="flex items-center space-x-2 pt-1 text-[10px]">
              <div className="flex -space-x-1.5 overflow-hidden">
                {event.rsvps.slice(0, 3).map((attendee) => (
                  <div 
                    key={attendee.id} 
                    className="inline-block h-5 w-5 rounded-full ring-1 ring-[#141416] bg-zinc-800 text-zinc-300 border border-white/10 font-bold uppercase text-[9px] flex items-center justify-center"
                    title={attendee.name}
                  >
                    {attendee.name.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                {event.rsvps.length} Registered
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
