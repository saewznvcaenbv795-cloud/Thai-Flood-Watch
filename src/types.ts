export interface WaterStation {
  id: string;
  stationId?: number;
  name: string;
  lat: number;
  lng: number;
  level: number; // 1: น้อยวิกฤต, 2: น้ำน้อย, 3: ปกติ, 4: น้ำมาก, 5: ล้นตลิ่ง
  pct: number | null; // % storage/channel capacity
  msl: number | null; // water level m. MSL
  delta: number | null; // change from previous
  bank: number | null; // min bank level m. MSL
  diffBank: number | null; // distance from bank
  diffBankText: string;
  province: string;
  amphoe: string;
  basin: string;
  agency: string;
  time: Date;
}

export interface RainStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  mm: number; // 24h rain
  mm1h: number | null;
  province: string;
  amphoe: string;
  agency: string;
  time: Date | null;
}

export interface DamData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pct: number;
  storage: number;
  inflow: number;
  released: number;
  normal?: number;
  province: string;
  date: string;
}

export interface GdacsAlert {
  id: string;
  name: string;
  description: string;
  alertlevel: string;
  fromdate: string;
  todate: string;
  reportUrl: string;
  lat: number;
  lng: number;
}

export interface FloodNews {
  title: string;
  source: string;
  link: string;
  published: string;
}

export interface CommunityPost {
  id: string;
  platform: 'x' | 'facebook' | 'citizen';
  author: string;
  handle?: string;
  category: 'rescue' | 'flood' | 'traffic' | 'general';
  text: string;
  province?: string;
  url?: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
}

export interface FloodCamera {
  id: string;
  name: string;
  location: string;
  province: string;
  category: 'river' | 'canal' | 'road' | 'gate';
  lat: number;
  lng: number;
  agency: string;
  status: 'normal' | 'watch' | 'flooded';
  statusText: string;
  streamUrl?: string;
  liveViewUrl: string;
  description: string;
}

export interface ThaiWaterState {
  stations: WaterStation[];
  rain: RainStation[];
  dams: DamData[];
  gdacs: GdacsAlert[];
  news: FloodNews[];
  updatedAt: Date | null;
  isLoading: boolean;
  error: string | null;
}
