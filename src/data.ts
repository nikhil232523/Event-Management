import { Event } from './types';

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Horizon Tech Summit 2026',
    description: 'Explore the next decade of web infrastructure, decentralized networking, and modern client architectures. Features keynote speakers, interactive panels, and technical tracks.',
    date: '2026-06-15',
    time: '09:00',
    location: 'Metropolitan Convention Center, Hall B',
    category: 'Conference',
    capacity: 150,
    organizer: 'Nikhil Mookken',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    rsvps: [
      { id: 'a1', name: 'Alex Johnson', email: 'alex@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-20T10:00:00Z' },
      { id: 'a2', name: 'Sarah Connor', email: 'sarah@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-21T11:15:00Z' },
      { id: 'a3', name: 'Marcus Wright', email: 'marcus@example.com', rsvpStatus: 'Maybe', joinedAt: '2026-05-22T09:30:00Z' },
      { id: 'a4', name: 'David Miller', email: 'david@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-25T14:20:00Z' },
      { id: 'a5', name: 'Elena Rostova', email: 'elena@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-28T16:45:00Z' }
    ]
  },
  {
    id: '2',
    title: 'Acoustic Sunset Session',
    description: 'An intimate open-air concert featuring local singer-songwriters. Enjoy warm ambient sessions, complimentary beverages, and beautiful sunset harbor views.',
    date: '2026-06-02',
    time: '18:00',
    location: 'Bayside Amphitheater, Pier 17',
    category: 'Concert',
    capacity: 50,
    organizer: 'Harbor Sounds Inc.',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60',
    rsvps: [
      { id: 'b1', name: 'John Doe', email: 'john@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-29T18:00:00Z' },
      { id: 'b2', name: 'Emma Watson', email: 'emma@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-29T18:30:00Z' },
      { id: 'b3', name: 'Liam Neeson', email: 'liam@example.com', rsvpStatus: 'Going', joinedAt: '2026-05-30T09:00:00Z' },
      { id: 'b4', name: 'Sophia Loren', email: 'sophia@example.com', rsvpStatus: 'Maybe', joinedAt: '2026-05-30T10:15:00Z' }
    ]
  },
  {
    id: '3',
    title: 'Creative Typography & Branding Lab',
    description: 'A hands-on workshop covering type scaling, contrast ratios, font pairing, and expressiveness in identity design. High-fidelity visual assets will be reviewed.',
    date: '2026-06-28',
    time: '13:00',
    location: 'The Design Loft, Studio 4A',
    category: 'Workshop',
    capacity: 24,
    organizer: 'Type & Grid Guild',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    rsvps: [
      { id: 'c1', name: 'Clara Oswald', email: 'clara@example.com', rsvpStatus: 'Going', joinedAt: '2026-06-01T12:00:00Z' },
      { id: 'c2', name: 'Peter Capaldi', email: 'peter@example.com', rsvpStatus: 'Going', joinedAt: '2026-06-01T12:10:00Z' }
    ]
  },
  {
    id: '4',
    title: 'Global Modern Art Exhibition',
    description: 'A curated gallery showcase featuring sculpture, paintings, and immersive digital installations from emerging contemporary artists around the globe.',
    date: '2026-05-20',
    time: '10:00',
    location: 'Vanguard Gallery, Downtown',
    category: 'Exhibition',
    capacity: 200,
    organizer: 'Vanguard Fine Arts',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60',
    rsvps: [
      { id: 'd1', name: 'Bruce Wayne', email: 'bruce@gotham.com', rsvpStatus: 'Going', joinedAt: '2026-05-10T10:00:00Z' },
      { id: 'd2', name: 'Diana Prince', email: 'diana@themyscira.com', rsvpStatus: 'Going', joinedAt: '2026-05-11T12:00:00Z' },
      { id: 'd3', name: 'Clark Kent', email: 'clark@dailyplanet.com', rsvpStatus: 'Going', joinedAt: '2026-05-12T14:30:00Z' }
    ]
  }
];

export const CATEGORIES: { value: Event['category']; label: string; color: string; bg: string; border: string }[] = [
  { value: 'Conference', label: 'Conference', color: 'text-[#C5A059]', bg: 'bg-[#C5A059]/10', border: 'border-[#C5A059]/30' },
  { value: 'Concert', label: 'Concert', color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-900/40' },
  { value: 'Workshop', label: 'Workshop', color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-900/40' },
  { value: 'Social', label: 'Social', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900/40' },
  { value: 'Exhibition', label: 'Exhibition', color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-900/40' },
  { value: 'Other', label: 'Other', color: 'text-zinc-400', bg: 'bg-zinc-900/40', border: 'border-zinc-800/40' }
];

export function getCategoryStyle(category: Event['category']) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[5];
}
