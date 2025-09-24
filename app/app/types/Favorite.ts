import { Hotel } from "./Hotel";

export type Favorite = {
    id: number;
    hotel: Hotel;
    addedAt: string;
};