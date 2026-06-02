import React from 'react';
import { EventFilter, EventCategory } from '../types';
import { CATEGORIES } from '../data';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';

interface FilterControlProps {
  filter: EventFilter;
  onChangeFilter: (update: Partial<EventFilter>) => void;
  onCreateClick: () => void;
}

export default function FilterControl({ filter, onChangeFilter, onCreateClick }: FilterControlProps) {
  return (
    <div className="bg-[#141416] border border-white/10 p-5 rounded-2xl space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
            placeholder="Search events by title, organizer, or venue..."
            className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all"
          />
        </div>

        {/* Filters and CTA Alignment */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Select */}
          <div className="flex items-center space-x-2 bg-[#0A0A0B] px-3.5 py-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Period</span>
            <select
              value={filter.status}
              onChange={(e) => onChangeFilter({ status: e.target.value as EventFilter['status'] })}
              className="bg-transparent border-none text-xs text-zinc-300 font-medium focus:outline-hidden focus:ring-0 cursor-pointer pr-1 [&>option]:bg-[#141416] [&>option]:text-white"
            >
              <option value="All">All Periods</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live Today</option>
              <option value="Completed">Completed</option>
              <option value="Full">Sold Out</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center space-x-2 bg-[#0A0A0B] px-3.5 py-2.5 rounded-xl border border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 hover:text-[#C5A059]" />
            <select
              value={filter.sortBy}
              onChange={(e) => onChangeFilter({ sortBy: e.target.value as EventFilter['sortBy'] })}
              className="bg-transparent border-none text-xs text-zinc-300 font-medium focus:outline-hidden focus:ring-0 cursor-pointer [&>option]:bg-[#141416] [&>option]:text-white"
            >
              <option value="date-asc">Chronological</option>
              <option value="date-desc">Latest Published</option>
              <option value="rsvps-desc">Attendees count</option>
              <option value="capacity-left">Available Slots</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-6 py-2.5 border border-[#C5A059]/40 hover:border-[#C5A059] rounded-full text-[10px] uppercase tracking-widest bg-[#C5A059]/10 hover:bg-[#C5A059] text-white hover:text-black transition-all duration-300 active:scale-97 cursor-pointer shadow-[0_0_8px_rgba(197,160,89,0.1)] hover:shadow-[0_0_12px_rgba(197,160,89,0.3)] font-semibold"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Category Toggles (represented as pills) */}
      <div className="pt-3.5 border-t border-white/[0.06] flex flex-wrap gap-1.5 items-center">
        <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase mr-2">Categories:</span>
        
        <button
          onClick={() => onChangeFilter({ category: 'All' })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
            filter.category === 'All'
              ? 'bg-[#C5A059] text-black shadow-xs'
              : 'bg-[#0A0A0B] hover:bg-white/5 text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          All Genres
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChangeFilter({ category: cat.value })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition ${
              filter.category === cat.value
                ? 'bg-white text-black border-white shadow-xs'
                : 'bg-[#0A0A0B] hover:bg-white/5 text-zinc-400 hover:text-white border-white/[0.08]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
