import React from 'react';
import { Event } from '../types';
import { Calendar, Users, TrendingUp, Sparkles } from 'lucide-react';

interface StatsDashboardProps {
  events: Event[];
}

export default function StatsDashboard({ events }: StatsDashboardProps) {
  // Calculations
  const totalEvents = events.length;
  
  const currentDate = new Date('2026-06-02'); // Fixed assessment time to keep logic consistent
  
  const upcomingEvents = events.filter(e => {
    const eventTime = new Date(`${e.date}T${e.time || '00:00'}`);
    return eventTime >= currentDate;
  }).length;
  
  const totalGoing = events.reduce((sum, event) => {
    const going = event.rsvps.filter(r => r.rsvpStatus === 'Going').length;
    return sum + going;
  }, 0);

  const totalMaybe = events.reduce((sum, event) => {
    const maybe = event.rsvps.filter(r => r.rsvpStatus === 'Maybe').length;
    return sum + maybe;
  }, 0);

  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRSVPs = totalGoing + totalMaybe;
  
  const utilizationRate = totalCapacity > 0 
    ? Math.round((totalGoing / totalCapacity) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Events */}
      <div className="bg-[#141416] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Total Events</p>
            <h3 className="text-3xl font-serif text-white italic tracking-tight mt-1">{totalEvents}</h3>
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[#C5A059] border border-white/5">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-[10px] text-zinc-500 font-mono">
          <span className="text-[#C5A059] font-medium mr-1.5">&#x2713;</span>
          <span>Managed natively</span>
        </div>
      </div>

      {/* Confirmed Guests */}
      <div className="bg-[#141416] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Confirmed RSVPs</p>
            <h3 className="text-3xl font-serif text-white italic tracking-tight mt-1">
              {totalGoing} <span className="text-xs font-sans not-italic text-zinc-500 ml-1">/ {totalRSVPs} total</span>
            </h3>
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[#C5A059] border border-white/5">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-[10px] text-zinc-500 font-mono">
          <span className="text-zinc-400 font-semibold mr-1">{totalMaybe}</span>
          <span>pending confirmation</span>
        </div>
      </div>

      {/* Utilization Rate */}
      <div className="bg-[#141416] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="flex items-center justify-between font-mono">
          <div>
            <p className="text-[10px] tracking-widest text-zinc-500 uppercase font-sans">Avg Occupancy</p>
            <h3 className="text-3xl font-serif text-white italic mt-1 font-sans">{utilizationRate}%</h3>
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[#C5A059] border border-white/5">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4.5">
          <div className="w-full bg-white/5 rounded-full h-1">
            <div 
              className="bg-[#C5A059] h-1 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(197,160,89,0.4)]" 
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Upcoming count */}
      <div className="bg-[#141416] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Upcoming Events</p>
            <h3 className="text-3xl font-serif text-white italic tracking-tight mt-1">{upcomingEvents}</h3>
          </div>
          <div className="p-3 bg-white/5 rounded-xl text-[#C5A059] border border-white/5">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-[10px] text-zinc-500 font-mono">
          <span>Active schedule period</span>
        </div>
      </div>
    </div>
  );
}
