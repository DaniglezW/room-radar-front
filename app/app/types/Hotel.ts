export type Hotel = {
  id: number;
  name: string;
  city: string;
  country: string;
  description?: string;
  stars?: number;
  images: {
    id: number;
    imageData: string | null;
    description?: string;
    isMain: boolean;
  }[];
};