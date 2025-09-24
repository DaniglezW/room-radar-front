import { useCurrency } from "@/context/CurrencyContext";
import { Hotel } from "../types/Hotel";
import { Room } from "../types/Room";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface Props {
    hotel: Hotel;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
}

export default function ReservationSummary({ hotel, room, checkInDate, checkOutDate, guests }: Readonly<Props>) {

    const [showMap, setShowMap] = useState(false);
    const { formatPrice } = useCurrency();
    const modalRef = useRef<HTMLDivElement>(null);

    const nights = Math.max(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24), 1
    );
    const totalPrice = room.pricePerNight * nights;

    const mainImage = hotel.images.find(img => img.isMain) ?? hotel.images[0];
    const imageSrc = mainImage?.imageData
        ? `data:image/jpeg;base64,${mainImage.imageData}`
        : "/app/defaultHotel.png";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowMap(false);
            }
        };
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") setShowMap(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md sticky top-4">
            {/* Imagen del hotel */}

            <img
                src={imageSrc}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-lg shadow-sm w-auto h-auto"
            />

            {/* Nombre del hotel */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{hotel.name}</h2>
                {/* Icono de mapa */}
                <MapPin
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    size={24}
                    onClick={() => setShowMap(true)}
                />
            </div>

            {/* Detalles de la reserva */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
                <p>
                    <span className="font-medium">Habitación:</span> {room.type} (Nº {room.id})
                </p>
                <p>
                    <span className="font-medium">Fechas:</span> {checkInDate} - {checkOutDate}
                </p>
                <span><strong>({nights} noches)</strong></span>
                <p>
                    <span className="font-medium">Huéspedes:</span> {guests}
                </p>
            </div>

            {/* Precio */}
            <div className="border-t border-gray-200 pt-4 space-y-1">
                <p>
                    <span className="font-medium">Precio por noche:</span> {room.pricePerNight.toFixed(2)}
                </p>
                <p className="font-semibold text-lg">
                    Total: {formatPrice(totalPrice)}
                </p>
            </div>

            {/* Modal del mapa */}
            {showMap && (
                <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black/50">
                    <div ref={modalRef} className="bg-white rounded-lg w-11/12 max-w-lg p-4 relative">
                        <button
                            onClick={() => setShowMap(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
                        >
                            X
                        </button>
                        <iframe
                            title="Mapa del hotel"
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(`${hotel.address}, ${hotel.city}, ${hotel.country}`)}&output=embed&gestureHandling=greedy`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
