import React, { useState, useEffect } from 'react';
import { Event, EventFilter, Attendee } from './types';
import { INITIAL_EVENTS } from './data';
import StatsDashboard from './components/StatsDashboard';
import FilterControl from './components/FilterControl';
import EventCard from './components/EventCard';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import { CalendarDays, AlertTriangle, Inbox, Sparkles, LogOut } from 'lucide-react';

export default function App() {
  // State Initialization
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [filter, setFilter] = useState<EventFilter>({
    searchQuery: '',
    category: 'All',
    status: 'All',
    sortBy: 'date-asc'
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('event_manager_records');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(INITIAL_EVENTS);
      }
    } else {
      setEvents(INITIAL_EVENTS);
    }
  }, []);

  // Sync to local storage
  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('event_manager_records', JSON.stringify(updatedEvents));
  };

  // Helper timestamp
  const makeTimestamp = () => new Date().toISOString();

  // Selected Event computation
  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // Search, filtration and sorting pipelines
  const todayStr = '2026-06-02';

  const filteredEvents = events.filter(e => {
    // 1. Search Query
    const searchLower = filter.searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      e.title.toLowerCase().includes(searchLower) ||
      e.description.toLowerCase().includes(searchLower) ||
      e.location.toLowerCase().includes(searchLower) ||
      e.organizer.toLowerCase().includes(searchLower);

    // 2. Category Filter
    const matchesCategory = filter.category === 'All' || e.category === filter.category;

    // 3. Status Filter
    let matchesStatus = true;
    const goingCount = e.rsvps.filter(r => r.rsvpStatus === 'Going').length;
    
    if (filter.status === 'Upcoming') {
      matchesStatus = e.date > todayStr;
    } else if (filter.status === 'Live') {
      matchesStatus = e.date === todayStr;
    } else if (filter.status === 'Completed') {
      matchesStatus = e.date < todayStr;
    } else if (filter.status === 'Full') {
      matchesStatus = goingCount >= e.capacity;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    // 4. Sorting
    if (filter.sortBy === 'date-asc') {
      const aTime = `${a.date}T${a.time || '00:00'}`;
      const bTime = `${b.date}T${b.time || '00:00'}`;
      return aTime.localeCompare(bTime);
    }
    if (filter.sortBy === 'date-desc') {
      const aTime = `${a.date}T${a.time || '00:00'}`;
      const bTime = `${b.date}T${b.time || '00:00'}`;
      return bTime.localeCompare(aTime);
    }
    if (filter.sortBy === 'rsvps-desc') {
      const aGoing = a.rsvps.filter(r => r.rsvpStatus === 'Going').length;
      const bGoing = b.rsvps.filter(r => r.rsvpStatus === 'Going').length;
      return bGoing - aGoing;
    }
    if (filter.sortBy === 'capacity-left') {
      const aLeft = a.capacity - a.rsvps.filter(r => r.rsvpStatus === 'Going').length;
      const bLeft = b.capacity - b.rsvps.filter(r => r.rsvpStatus === 'Going').length;
      return aLeft - bLeft;
    }
    return 0;
  });

  // Auto-select first filtered event if selection is invalid or nullified
  useEffect(() => {
    if (filteredEvents.length > 0) {
      if (!selectedEventId || !filteredEvents.some(e => e.id === selectedEventId)) {
        setSelectedEventId(filteredEvents[0].id);
      }
    } else {
      setSelectedEventId(null);
    }
  }, [filteredEvents, selectedEventId]);

  // Handler: Add new event
  const handleSaveNewEvent = (newEventData: Omit<Event, 'rsvps'>) => {
    const freshEvent: Event = {
      ...newEventData,
      rsvps: []
    };
    const updated = [freshEvent, ...events];
    saveEvents(updated);
    setSelectedEventId(freshEvent.id);
    setIsCreating(false);
  };

  // Handler: Update edited event
  const handleSaveEditedEvent = (editedData: Omit<Event, 'rsvps'> & { rsvps?: Event['rsvps'] }) => {
    const updated = events.map(e => e.id === editedData.id ? { 
      ...e, 
      ...editedData,
      rsvps: editedData.rsvps || e.rsvps // preserve state if editing
    } : e);
    saveEvents(updated);
    setEditingEvent(null);
  };

  // Handler: Delete event
  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    saveEvents(updated);
    // Find next candidate for auto-selection
    const remainingFiltered = filteredEvents.filter(e => e.id !== eventId);
    if (remainingFiltered.length > 0) {
      setSelectedEventId(remainingFiltered[0].id);
    } else {
      setSelectedEventId(null);
    }
  };

  // Handler: Record new RSVP
  const handleAddRSVP = (eventId: string, attendeeData: Omit<Attendee, 'id' | 'joinedAt'>) => {
    const newAttendee: Attendee = {
      id: Math.random().toString(36).substr(2, 9),
      ...attendeeData,
      joinedAt: makeTimestamp()
    };

    const updated = events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          rsvps: [...e.rsvps, newAttendee]
        };
      }
      return e;
    });

    saveEvents(updated);
  };

  // Handler: Remove/cancel RSVP coordinate
  const handleRemoveRSVP = (eventId: string, attendeeId: string) => {
    const updated = events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          rsvps: e.rsvps.filter(r => r.id !== attendeeId)
        };
      }
      return e;
    });
    saveEvents(updated);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans antialiased">
      {/* Top Professional Banner Bar */}
      <header className="bg-[#0A0A0B]/90 border-b border-white/10 py-4.5 px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3 select-none">
            <div className="p-2.5 bg-[#141416]/80 text-[#C5A059] rounded-xl border border-white/10 shadow-xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif italic text-white tracking-tight flex items-center">
                Event<span className="text-[#C5A059] font-sans not-italic font-bold ml-0.5">OS</span>
                <span className="ml-2.5 font-sans not-italic text-[9px] font-mono tracking-widest bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 px-2 py-0.5 rounded-sm uppercase">
                  Premium Admin
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Sophisticated scheduling logistics and active roster metrics</p>
            </div>
          </div>

          {/* User profile / Live context */}
          <div className="flex items-center space-x-2.5 bg-[#141416] px-3.5 py-1.5 rounded-xl border border-white/10">
            <div className="h-2 w-2 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
            <div className="text-right">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Operator Session</p>
              <p className="text-xs font-semibold text-zinc-300">nikhilkurian.mookken@gmail.com</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-6">
        
        {/* KPI Summary Dashboard */}
        <StatsDashboard events={events} />

        {/* Dynamic Filters Control Deck */}
        <FilterControl 
          filter={filter}
          onChangeFilter={(update) => setFilter(prev => ({ ...prev, ...update }))}
          onCreateClick={() => {
            setEditingEvent(null);
            setIsCreating(true);
          }}
        />

        {/* Center operational interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: List of items Cards Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase">
                  Timeline Board
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Showing {filteredEvents.length} active logs</p>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-[#141416] border border-white/10 rounded-2xl py-16 px-6 text-center shadow-xs">
                <Inbox className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-serif italic text-white tracking-tight">No Events Matches Filter</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Try adjusting the query parameters, toggling categories, or publishing a brand-new custom log from the Control suite.
                </p>
                <button
                  onClick={() => setFilter({ searchQuery: '', category: 'All', status: 'All', sortBy: 'date-asc' })}
                  className="mt-4 px-4 py-2 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white font-medium text-xs rounded-xl tracking-wider uppercase transition cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(item => (
                  <EventCard
                    key={item.id}
                    event={item}
                    isSelected={selectedEventId === item.id && !isCreating && !editingEvent}
                    onSelect={() => {
                      setIsCreating(false);
                      setEditingEvent(null);
                      setSelectedEventId(item.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Form Workspace / Complete Details Reader */}
          <div className="lg:col-span-5 h-full">
            {isCreating ? (
              <EventForm
                onSave={handleSaveNewEvent}
                onCancel={() => setIsCreating(false)}
              />
            ) : editingEvent ? (
              <EventForm
                eventToEdit={editingEvent}
                onSave={handleSaveEditedEvent}
                onCancel={() => setEditingEvent(null)}
              />
            ) : selectedEvent ? (
              <EventDetails
                event={selectedEvent}
                onAddRSVP={handleAddRSVP}
                onRemoveRSVP={handleRemoveRSVP}
                onEditEvent={(ev) => setEditingEvent(ev)}
                onDeleteEvent={handleDeleteEvent}
              />
            ) : (
              <div className="bg-[#141416] border border-white/10 rounded-2xl p-10 text-center shadow-xs py-24 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-4 border border-[#C5A059]/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-serif italic text-white tracking-tight">Select an Event to View</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Click on any interactive row or banner on the matrix board to preview logistical metrics and attendee rosters.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Elegant minimalist page footer */}
      <footer className="bg-[#0A0A0B] border-t border-white/5 py-8 mt-16 text-center select-none text-zinc-600">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase">
          &copy; 2026 EventOS Creative Engine &bull; System Status Optimal
        </p>
      </footer>
    </div>
  );
}
