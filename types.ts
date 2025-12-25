
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export type PhotoFilter = 'none' | 'sepia' | 'bw' | 'vintage' | 'warm' | 'cool';

export interface SelfieState {
  image1: string | null;
  image2: string | null;
  location: string;
  customLocation: string;
  mobilePhone: string;
  customMobilePhone: string;
  aspectRatio: AspectRatio;
  filter: PhotoFilter;
  blurIntensity: number; // 0 to 100
  isGenerating: boolean;
  result: string | null;
  error: string | null;
}

export enum LocationPreset {
  DISNEYLAND_PARIS = "Disneyland Paris",
  EIFFEL_TOWER = "Eiffel Tower",
  GREAT_WALL = "Great Wall of China",
  GRAND_CANYON = "Grand Canyon",
  SANTORINI = "Santorini, Greece",
  TAJ_MAHAL = "Taj Mahal, India",
  BURJ_KHALIFA = "Burj Khalifa, Dubai",
  BELGIUM_ATOMIUM = "Atomium, Belgium"
}

export enum MobilePhonePreset {
  IPHONE_15_PRO = "iPhone 15 Pro",
  IPHONE_15 = "iPhone 15",
  IPHONE_14_PRO = "iPhone 14 Pro",
  SAMSUNG_S24_ULTRA = "Samsung Galaxy S24 Ultra",
  SAMSUNG_S23 = "Samsung Galaxy S23",
  SAMSUNG_Z_FOLD = "Samsung Galaxy Z Fold 5",
  GOOGLE_PIXEL_8_PRO = "Google Pixel 8 Pro",
  GOOGLE_PIXEL_7 = "Google Pixel 7",
  CUSTOM = "Custom Device"
}
