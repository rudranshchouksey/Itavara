export * from '@itvara/db';
export * from './auth';
export * from './verification';
export * from './user';

export enum ThemePreference {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM'
}

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

// Phase 36: Group Rooms
export interface GroupRoomDTO {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
}

export interface GroupMessageDTO {
  id: string;
  roomId: string;
  senderId: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface WebRTCSignalDTO {
  roomId: string;
  senderId: string;
  targetUserId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

// Phase 37: Guide
export interface GuideProfileDTO {
  id: string;
  userId: string;
  hourlyRate: number;
  dailyRate: number;
  languages: string[];
  specialties: string[];
  experienceYears: number;
  rating: number;
  isVerified: boolean;
}

export interface GuideHireRequestDTO {
  guideId: string;
  date: string;
  durationHours: number;
}

// Phase 38: Rentals
export interface RentalItemDTO {
  id: string;
  hostId: string;
  locality: string;
  category: 'VEHICLE_CAB' | 'VEHICLE_BIKE' | 'CULTURAL_ATTIRE';
  title: string;
  description: string;
  pricePerDay: number;
  imageUrls: string[];
  sizesAvailable: string[];
  isAvailable: boolean;
}

export interface RentalBookingDTO {
  rentalItemId: string;
  stayBookingId?: string;
  startDate: string;
  endDate: string;
  selectedSize?: string;
}

// Phase 39: Superhost
export interface SuperhostMentorshipDTO {
  id: string;
  superhostId: string;
  aspiringHostId: string;
  scheduledAt: string;
  topic: 'LISTING_PREP' | 'PRICING_STRATEGY' | 'HOSPITALITY_TIPS';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface MentorshipSessionRequestDTO {
  superhostId: string;
  scheduledAt: string;
  topic: 'LISTING_PREP' | 'PRICING_STRATEGY' | 'HOSPITALITY_TIPS';
  notes?: string;
}

// Phase 40: Corporate
export interface CorporateAccountDTO {
  id: string;
  companyName: string;
  billingEmail: string;
  gstinTaxId?: string;
  creditLimit: number;
}

export interface CorporateBookingPolicyDTO {
  corporateAccountId: string;
  maxNightlyRate: number;
  allowedStayTypes: string[];
}

export interface CorporateInvoiceDTO {
  corporateAccount: string;
  billingEmail: string;
  gstin: string;
  period: string;
  breakdown: {
    subtotal: number;
    gstRate: string;
    gstAmount: number;
    totalAmount: number;
  };
  bookings: any[];
}
