import Link from "next/link";
import { Eye } from "lucide-react";
import StarRating from "./StarRating";
import { Hotel } from "../types/Hotel";
import { useCurrency } from "@/context/CurrencyContext";
import { HotelWithRating } from "../types/hotelSearched";
import LoadingSpinner from "./LoadingSpinner";

interface SearchResultsListProps {
    hotels: HotelWithRating[];
    checkInDate: string | null;
    checkOutDate: string | null;
    maxGuests: number | null;
}

export default function SearchResultsList({ hotels, checkInDate, checkOutDate, maxGuests }: Readonly<SearchResultsListProps>) {

    const { formatPrice } = useCurrency();

    if (hotels.length === 0) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-8">
            {hotels.map((hotel) => {
                const filteredavailableRooms = hotel.availableRooms.filter(room =>
                    maxGuests ? room.maxGuests >= maxGuests : true
                );
                const availableRoomsToShow = filteredavailableRooms.slice(0, 2);

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
                            href={`/hotel/${hotel.id}?checkInDate=${checkInDate ?? ''}&checkOutDate=${checkOutDate ?? ''}&maxGuests=${maxGuests ?? 1}`}
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
                        <div className="p-6 flex-1 flex flex-col justify-between relative">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                                <StarRating rating={hotel.stars} />
                                <p className="text-gray-600 text-sm mt-1 mb-3">
                                    {hotel.address}, {hotel.city}, {hotel.country}
                                </p>
                                <p className="text-gray-700 text-base mb-4 leading-relaxed">{hotel.description}</p>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-lg text-gray-800">Habitaciones disponibles:</h4>
                                    {availableRoomsToShow.map(room => (
                                        <div key={room.id} className="text-gray-700 text-sm">
                                            <span className="font-medium">{room.type}</span> – {formatPrice(room.pricePerNight)}€ por noche – hasta <span className="font-medium">{room.maxGuests}</span> personas
                                        </div>
                                    ))}

                                    {filteredavailableRooms.length > 2 && (
                                        <p className="text-sm text-blue-600 mt-1 font-semibold hover:underline cursor-pointer">
                                            ... y más habitaciones
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Nota global del hotel */}
                            {hotel.overallRating !== null && hotel.overallRating !== undefined && hotel.overallRating !== 0 && (
                                <div
                                    className="absolute bottom-4 right-4 font-bold px-3 py-1 rounded-full text-white"
                                    style={{ backgroundColor: '#2F6FEB' }}
                                >
                                    {hotel.overallRating.toFixed(1)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
