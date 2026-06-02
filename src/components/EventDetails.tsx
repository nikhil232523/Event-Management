import React, { useState } from 'react';
import { Event, Attendee } from '../types';
import { getCategoryStyle } from '../data';
import { Calendar, Clock, MapPin, User, Users, Trash2, Edit3, UserCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
  onAddRSVP: (eventId: string, attendee: Omit<Attendee, 'id' | 'joinedAt'>) => void;
  onRemoveRSVP: (eventId: string, attendeeId: string) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function EventDetails({ event, onAddRSVP, onRemoveRSVP, onEditEvent, onDeleteEvent }: EventDetailsProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<Attendee['rsvpStatus']>('Going');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const catStyle = getCategoryStyle(event.category);
  const goingAttendees = event.rsvps.filter(r => r.rsvpStatus === 'Going');
  const maybeAttendees = event.rsvps.filter(r => r.rsvpStatus === 'Maybe');
  const isFull = goingAttendees.length >= event.capacity;

  const handleSubmitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Initial Validations
    if (!name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Check Duplicate RSVPs (by Email)
    const isDuplicate = event.rsvps.some(
      r => r.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (isDuplicate) {
      setFormError('This email is already registered for this event');
      return;
    }

    // Capacity checks
    if (rsvpStatus === 'Going' && isFull) {
      setFormError('This event is fully booked for "Going" status. You can register as "Maybe" safely.');
      return;
    }

    // Register !
    onAddRSVP(event.id, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      rsvpStatus
    });

    // Reset Form & show success
    setName('');
    setEmail('');
    setRsvpStatus('Going');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  return (
    <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden animate-fade-in lg:sticky lg:top-24">
      {/* Banner Area */}
      <div className="h-56 relative bg-zinc-900 border-b border-white/5">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'} 
          alt={event.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/30 to-black/40"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-black/60 shadow-xs border ${catStyle.border} ${catStyle.color}`}>
            {event.category}
          </span>
        </div>

        {/* Action Controls for Event Owner */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={() => onEditEvent(event)}
            className="p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-[#C5A059] hover:scale-105 active:scale-95 transition"
            title="Edit Event Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          {showConfirmDelete ? (
            <div className="flex items-center space-x-1 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-rose-900/40">
              <span className="text-[9px] text-rose-400 font-bold px-1 uppercase tracking-wider font-mono">Remove?</span>
              <button
                onClick={() => onDeleteEvent(event.id)}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-rose-400 hover:scale-105 active:scale-95 transition"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-5 left-6 right-6 text-white space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
            <span>{event.date}</span>
            <span>&bull;</span>
            <span>{event.time}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight leading-tight line-clamp-2">
            {event.title}
          </h2>
        </div>
      </div>

      {/* Main Content Info Splits */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            Logistical Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0A0A0B] p-4 rounded-xl border border-white/5">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-500 font-medium font-mono uppercase tracking-wide">Location Venue</p>
                <p className="text-xs font-semibold text-zinc-300 mt-0.5">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <User className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-500 font-medium font-mono uppercase tracking-wide">Executive Producer</p>
                <p className="text-xs font-semibold text-zinc-300 mt-0.5">{event.organizer}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-500 font-medium font-mono uppercase tracking-wide">Scheduled Time</p>
                <p className="text-xs font-semibold text-zinc-300 mt-0.5">{event.time} Local</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Users className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-zinc-500 font-medium font-mono uppercase tracking-wide">Enrolled Capacity</p>
                <p className="text-xs font-semibold text-zinc-300 mt-0.5">
                  {goingAttendees.length} / {event.capacity} active seats
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Manifesto</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {event.description}
          </p>
        </div>

        {/* Dual Panels: RSVP form + Guest list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-white/[0.06]">
          
          {/* Guest Registration Form */}
          <div className="space-y-4">
            <div>
              <h3 className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                RSVP Registration
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Secure your entry pass status.</p>
            </div>

            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 animate-fade-in border border-emerald-900/30">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Rostered successfully! Pass is active.</span>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 text-xs rounded-xl flex items-center space-x-2 animate-fade-in border border-rose-900/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRSVP} className="space-y-3">
              <div>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-hidden focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-hidden focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('Going')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all uppercase tracking-wide cursor-pointer ${rsvpStatus === 'Going' ? 'bg-[#C5A059] border-[#C5A059] text-black' : 'bg-[#0A0A0B] border-white/10 text-zinc-400 hover:text-white'}`}
                >
                  Going
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus('Maybe')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all uppercase tracking-wide cursor-pointer ${rsvpStatus === 'Maybe' ? 'bg-[#C5A059]/20 border-[#C5A059]/40 text-[#C5A059]' : 'bg-[#0A0A0B] border-white/10 text-zinc-400 hover:text-white'}`}
                >
                  Maybe
                </button>
              </div>

              <button
                type="submit"
                disabled={isFull && rsvpStatus === 'Going'}
                className="w-full py-2.5 text-xs text-black bg-[#C5A059] hover:bg-[#bfa058] font-bold rounded-xl tracking-widest uppercase transition duration-300 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                {isFull && rsvpStatus === 'Going' ? 'Roster is Occupied' : 'Secure Ticket'}
              </button>
            </form>
          </div>

          {/* Guest Roster / Active list */}
          <div className="space-y-3 flex flex-col h-full max-h-64">
            <div>
              <h3 className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase">
                Active Registry
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {event.rsvps.length} guests ({goingAttendees.length} going, {maybeAttendees.length} temporary)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-52 custom-scrollbar">
              {event.rsvps.length === 0 ? (
                <div className="text-center py-8 bg-[#0A0A0B] rounded-xl border border-dashed border-white/5">
                  <UserCheck className="w-5 h-5 text-zinc-750 mx-auto mb-1 animate-pulse" />
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Roster unoccupied</p>
                </div>
              ) : (
                event.rsvps.map((attendee) => (
                  <div 
                    key={attendee.id}
                    className="p-2.5 bg-[#0A0A0B] border border-white/5 rounded-xl flex items-center justify-between group/item"
                  >
                    <div className="flex items-center space-x-2 select-none min-w-0 flex-1">
                      <div className="h-7 w-7 rounded-lg text-xs font-bold uppercase text-[#C5A059] flex items-center justify-center bg-[#C5A059]/10 border border-[#C5A059]/20 font-mono shrink-0">
                        {attendee.name.charAt(0)}
                      </div>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-zinc-300 truncate max-w-[124px]">{attendee.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[124px]">{attendee.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${attendee.rsvpStatus === 'Going' ? 'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/15' : 'bg-zinc-800 text-zinc-400 border border-white/5'}`}>
                        {attendee.rsvpStatus}
                      </span>
                      <button
                        onClick={() => onRemoveRSVP(event.id, attendee.id)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 opacity-0 group-hover/item:opacity-100 transition duration-300"
                        title="Remove RSVP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
