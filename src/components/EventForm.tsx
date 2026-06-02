import React, { useState, useEffect } from 'react';
import { Event, EventCategory } from '../types';
import { CATEGORIES } from '../data';
import { Calendar, Clock, MapPin, Users, User, Image as ImageIcon, X } from 'lucide-react';

interface EventFormProps {
  onSave: (event: Omit<Event, 'rsvps'> & { rsvps?: Event['rsvps'] }) => void;
  onCancel: () => void;
  eventToEdit?: Event | null;
}

const PRESET_IMAGES = [
  { label: 'Technology / Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60' },
  { label: 'Music / Concert', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60' },
  { label: 'Design / Workshop', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60' },
  { label: 'Art / Exhibition', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60' },
  { label: 'Meetup / Social', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60' },
  { label: 'Business / Lounge', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60' },
  { label: 'Indian Festival', url: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&auto=format&fit=crop&q=60' },
  { label: 'National Festival', url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=60' }
];

export default function EventForm({ onSave, onCancel, eventToEdit }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('Conference');
  const [capacity, setCapacity] = useState<number>(50);
  const [organizer, setOrganizer] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[2].url); // default
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // If editing, load original event details
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setLocation(eventToEdit.location);
      setCategory(eventToEdit.category);
      setCapacity(eventToEdit.capacity);
      setOrganizer(eventToEdit.organizer);
      setImageUrl(eventToEdit.imageUrl || PRESET_IMAGES[0].url);
    } else {
      // Pre-fill placeholder date (2026-06-10) for easier user testing
      setDate('2026-06-10');
      setTime('14:00');
    }
  }, [eventToEdit]);

  const handleCategoryChange = (cat: EventCategory) => {
    setCategory(cat);
    // Auto-update suitable preset image if user hasn't explicitly customized it
    const mathcingPreset = PRESET_IMAGES.find(img => img.label.toLowerCase().includes(cat.toLowerCase()));
    if (mathcingPreset) {
      setImageUrl(mathcingPreset.url);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    if (!location.trim()) newErrors.location = 'Location/Venue is required';
    if (!organizer.trim()) newErrors.organizer = 'Organizer is required';
    if (capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';
    if (eventToEdit && eventToEdit.rsvps.length > capacity) {
      newErrors.capacity = `Capacity cannot be lower than current registrations count (${eventToEdit.rsvps.length})`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: eventToEdit ? eventToEdit.id : Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      capacity,
      organizer: organizer.trim(),
      imageUrl,
      ...(eventToEdit ? { rsvps: eventToEdit.rsvps } : {})
    });
  };

  return (
    <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden animate-fade-in">
      <div className="bg-[#0A0A0B] p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif italic text-white tracking-tight">
            {eventToEdit ? 'Modify Event Log' : 'Publish New Event'}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Please populate the necessary administrative fields.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
            Event Title / Headline
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Creative Engineering Lounge"
              className={`w-full bg-[#0A0A0B] border ${errors.title ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 px-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
            />
          </div>
          {errors.title && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.title}</p>}
        </div>

        {/* Category & Capacity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Event Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as EventCategory)}
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all [&>option]:bg-[#141416]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Roster Capacity
            </label>
            <div className="relative flex items-center">
              <Users className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)}
                className={`w-full bg-[#0A0A0B] border ${errors.capacity ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
              />
            </div>
            {errors.capacity && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.capacity}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
            Log Description / Outline
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Provide a logical outline of topics, target objective details, or session activities."
            className={`w-full bg-[#0A0A0B] border ${errors.description ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 px-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all resize-none`}
          ></textarea>
          {errors.description && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.description}</p>}
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Target Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full bg-[#0A0A0B] border ${errors.date ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
              />
            </div>
            {errors.date && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Target Time
            </label>
            <div className="relative flex items-center">
              <Clock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full bg-[#0A0A0B] border ${errors.time ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
              />
            </div>
            {errors.time && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.time}</p>}
          </div>
        </div>

        {/* Location & Organizer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Venue Location
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gallery Room 12"
                className={`w-full bg-[#0A0A0B] border ${errors.location ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
              />
            </div>
            {errors.location && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
              Host / Organizer
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Individual or Guild"
                className={`w-full bg-[#0A0A0B] border ${errors.organizer ? 'border-rose-500' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all`}
              />
            </div>
            {errors.organizer && <p className="text-rose-400 text-xs mt-1 font-sans">{errors.organizer}</p>}
          </div>
        </div>

        {/* Custom Image / Presets */}
        <div>
          <label className="block text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Curated Cover Choice
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {PRESET_IMAGES.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`group h-12 rounded-lg overflow-hidden border-2 relative transition ${imageUrl === preset.url ? 'border-[#C5A059] scale-102 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}
                title={preset.label}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover transition-property duration-350 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3.5" />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste customized image URL directly"
              className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-white transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#C5A059] text-black font-semibold rounded-xl text-xs uppercase tracking-widest transition duration-300"
          >
            {eventToEdit ? 'Save Changes' : 'Publish Log'}
          </button>
        </div>
      </form>
    </div>
  );
}
