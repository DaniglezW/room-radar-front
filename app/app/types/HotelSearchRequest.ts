export interface HotelSearchRequest {
    name: string;
    checkIn: string;  // formato ISO: yyyy-MM-dd
    checkOut: string;
    maxGuests: number;
}