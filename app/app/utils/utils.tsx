import { Hotel } from "../types/Hotel";

export class Utils {
    static getMainImage(hotel: Hotel): string {
        if (!hotel.images || hotel.images.length === 0) return "/defaultHotel.png";

        const mainImage = hotel.images.find((img) => img.isMain);
        const fallbackImage = hotel.images[0];

        const imageToUse = mainImage || fallbackImage;

        return imageToUse?.imageData
            ? `data:image/jpeg;base64,${imageToUse.imageData}`
            : "/defaultHotel.png";
    }
}