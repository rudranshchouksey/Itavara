export * from '@itvara/db';

export interface SearchListingsDTO {
  latitude?: number;
  longitude?: number;
  radius?: number;
  type?: string;
  maxGuests?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateBookingDTO {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  addOns?: Array<{ type: string; price: number }>;
}

export interface CreatePostDTO {
  type: 'PHOTO' | 'REEL' | 'MINI_BLOG';
  title?: string;
  content?: string;
  mediaUrls: string[];
  taggedListingId?: string;
  taggedUserId?: string;
}
