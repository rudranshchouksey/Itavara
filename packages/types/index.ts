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

// Phase 41: Ads
export interface SponsoredCampaignDTO {
  id: string;
  listingId: string;
  hostId: string;
  budget: number;
  spent: number;
  cpcRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdInteractionDTO {
  campaignId: string;
  type: 'IMPRESSION' | 'CLICK';
  signature: string; // generated using AD_CLICK_SIGNING_KEY
}

// Phase 42: Themes
export interface ThemePreferenceDTO {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
}

export interface UpdateThemeDTO {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
}

// Phase 43: Notifications
export interface NotificationPreferenceDTO {
  pauseAllUntil?: string;
  likesComments: boolean;
  followersTags: boolean;
  messagesCalls: boolean;
  marketingPromotions: boolean;
  securityAlerts: boolean;
}

export interface NotificationFeedDTO {
  notifications: any[]; // ideally mapped to a Notification interface
  nextCursor?: string;
}

// Phase 44: Privacy
export interface UserPrivacySettingDTO {
  isPrivateAccount: boolean;
  allowTaggingFrom: 'EVERYONE' | 'FOLLOWERS_ONLY' | 'NO_ONE';
  hiddenKeywords: string[];
  blockedUserIds: string[];
  mutedUserIds: string[];
}

export interface BlockUserDTO {
  userIdToBlock: string;
}

export interface MuteUserDTO {
  userIdToMute: string;
}

// Phase 45: Security
export interface TwoFactorSetupDTO {
  secret: string;
  qrCodeUrl: string;
}

export interface TwoFactorVerifyDTO {
  token: string;
}

export interface ActiveSessionDTO {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  token?: string;
}

// Phase 46-50: Universal Footer, Caching, and Health
export interface FooterLinkSectionDTO {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface LanguageOptionDTO {
  code: string;
  name: string;
}

export interface CurrencyOptionDTO {
  code: string;
  symbol: string;
  name: string;
}

export interface CacheConfigDTO {
  ttlSeconds: number;
  strategy: 'EXACT' | 'PROBABILISTIC';
}

export interface RateLimitRuleDTO {
  points: number;
  durationSeconds: number;
}

export interface HealthCheckResponseDTO {
  status: 'ok' | 'error';
  database?: 'connected' | 'disconnected';
  redis?: 'connected' | 'disconnected';
  timestamp: string;
  error?: string;
  message?: string;
}
