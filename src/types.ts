export interface Review {
  id: string;
  businessId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  ownerReply?: {
    date: string;
    comment: string;
  };
}

export interface BusinessListing {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  aiSummary?: string;
  category: string;
  subcategories: string[];
  logo: string;
  coverImage: string;
  photos: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  plan: 'free' | 'premium' | 'elite';
  verified: boolean;
  claimed: boolean;
  isOpenNow: boolean;
  distanceMiles?: number;
  lat: number;
  lng: number;
  hours: {
    [key in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']: string;
  };
  services: string[];
  products?: { name: string; price: string; image?: string }[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  ownerEmail?: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: 'Community' | 'Networking' | 'Expo' | 'Festival';
  image: string;
  description: string;
  organizer: string;
  price: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Local News' | 'Community Updates' | 'Business Tips' | 'Economic Development';
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  featured?: boolean;
}

export interface CustomerInquiry {
  id: string;
  businessId: string;
  businessName: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface MembershipPlan {
  id: 'free' | 'premium' | 'elite';
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  badge?: string;
  features: string[];
}

export interface AnalyticsStats {
  totalListings: number;
  activeListings: number;
  totalReviews: number;
  monthlySearches: number;
  monthlyLeads: number;
  revenueThisMonth: number;
  topCategories: { name: string; views: number }[];
}
