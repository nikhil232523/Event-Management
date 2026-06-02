export type EventCategory = 'Conference' | 'Social' | 'Workshop' | 'Concert' | 'Exhibition' | 'Other';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'Going' | 'Maybe';
  joinedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  category: EventCategory;
  capacity: number;
  organizer: string;
  rsvps: Attendee[];
  imageUrl?: string;
}

export interface EventFilter {
  searchQuery: string;
  category: EventCategory | 'All';
  status: 'All' | 'Upcoming' | 'Live' | 'Completed' | 'Full';
  sortBy: 'date-asc' | 'date-desc' | 'rsvps-desc' | 'capacity-left';
}
