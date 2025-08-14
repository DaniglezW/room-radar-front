export interface Room {
    id: number;
    type: string;
    pricePerNight: number;
    maxGuests: number;
    images: Array<{
        id: number;
        imageData: string;
        description?: string;
        isMain?: boolean;
    }>;
}