export interface VaultItem {
  id: string;
  name: string;
  cat: string;
  karat: string;
  weight: number;
  price: number;
  notes?: string;
  dateAdded?: string;
}

export interface WearLogItem {
  id: string;
  date: string;
  pieceName: string;
  pieceIndex?: number;
  vibe: string;
}

export type WeeklyPlan = Record<string, string>;

export interface WishlistItem {
  id: string;
  label: string;
  note?: string;
}

export interface BlogPost {
  url: string;
  title: string;
  blurb: string;
  cat: string;
  short: string;
  read: string;
  date: string;
  grad: string;
}

export interface Subscriber {
  user_id?: string;
  email: string;
  plan: 'pro' | 'free';
  date: string;
  status: string;
  confirmed?: boolean;
  lastSignIn?: string;
  isAdmin?: boolean;
  piecesCount?: number;
  amount: number;
}

export interface CurrencyConfig {
  symbol: string;
  name: string;
  rate: number;
  defaultLang: string;
}

export interface UserProfile {
  id?: string;
  email: string;
  is_pro?: boolean;
  created_at?: string;
}
