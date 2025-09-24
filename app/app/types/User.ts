export type Role = 'USER' | 'HOTEL_MANAGER' | 'ADMIN';

export interface UserDTO {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: Role;
    profilePicture?: string;
    googleProfilePictureUrl?: string;
    createdAt: string;
}