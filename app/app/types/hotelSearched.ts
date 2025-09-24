export interface HotelWithRating {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    description: string;
    stars: number;
    images: {
        isMain: boolean;
        imageData: string | null; // Base64 de la imagen
    }[];
    availableRooms: {
        id: number;
        type: string;
        pricePerNight: number;
        maxGuests: number;
    }[];
    overallRating: number | null; // Nota global del hotel
}