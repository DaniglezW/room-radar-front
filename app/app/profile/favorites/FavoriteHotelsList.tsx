import Link from "next/link";
import { Eye } from "lucide-react";
import StarRating from "../../components/StarRating";
import { Hotel } from "../../types/Hotel";

interface FavoriteHotelsListProps {
    hotels: Hotel[];
}

export default function FavoriteHotelsList({ hotels }: Readonly<FavoriteHotelsListProps>) {
    if (hotels.length === 0) {
        return <p className="text-center text-lg text-gray-500 mt-6">No tienes hoteles favoritos aún.</p>;
    }

    return (
        <div className="space-y-8">
            {hotels.map((hotel) => {
                const mainImage = hotel.images.find(img => img.isMain) ?? hotel.images[0];
                const imageSrc = mainImage?.imageData
                    ? `data:image/jpeg;base64,${mainImage.imageData}`
                    : "/app/defaultHotel.png";

                return (
                    <div
                        key={hotel.id}
                        className="relative flex flex-col md:flex-row border rounded-xl overflow-hidden shadow-md"
                    >
                        {/* Botón arriba a la derecha */}
                        <Link
                            href={`/hotel/${hotel.id}`}
                            className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-blue-700 transition-colors z-10 shadow-md"
                        >
                            <Eye size={16} />
                            Ver detalles
                        </Link>

                        {/* Imagen */}
                        <div className="w-full md:w-1/3 h-auto md:h-auto relative">
                            <img
                                src={imageSrc}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Contenido */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                                <StarRating rating={hotel.stars} />
                                <p className="text-gray-600 text-sm mt-1 mb-3">
                                    {hotel.address}, {hotel.city}, {hotel.country}
                                </p>
                                <p className="text-gray-700 text-base mb-4 leading-relaxed">{hotel.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
