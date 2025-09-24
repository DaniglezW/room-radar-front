'use client';

import { use, useEffect, useRef, useState } from 'react';
import HotelGallery from '@/app/components/HotelGallery';
import StarRating from '@/app/components/StarRating';
import { Hotel } from '@/app/types/Hotel';
import { Service } from '@/app/types/Service';
import HotelAmenities from '@/app/components/HotelAmenities';
import HotelReviews from '@/app/components/HotelReviews';
import DateRangePicker from '@/app/components/DateRangePicker';
import QuantityInput from '@/app/components/QuantityInput';
import { Users } from 'lucide-react';
import { format, formatISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useCurrency } from '@/context/CurrencyContext';

type Room = {
    id: number;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    available: boolean;
    maxGuests: number;
    images: any[];
};

export default function HotelPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const tableRef = useRef<HTMLDivElement | null>(null);
    const { formatPrice } = useCurrency();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [numPeople, setNumPeople] = useState(1);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            key: 'selection',
        },
    ]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const checkInDate = searchParams.get("checkInDate") || "";
    const checkOutDate = searchParams.get("checkOutDate") || "";
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;
    const formattedRange = `${format(dateRange[0].startDate, 'd MMM yyyy', { locale: es })} – ${format(dateRange[0].endDate, 'd MMM yyyy', { locale: es })}`;

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setError('ID de hotel inválido');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch hotel data
                const resHotel = await fetch(`${baseUrl}/hotel/v1/${id}`);
                if (!resHotel.ok) throw new Error(`Error ${resHotel.status}: ${resHotel.statusText}`);
                const dataHotel = await resHotel.json();
                setHotel(dataHotel.hotel);

                // Fetch hotel services
                const resServices = await fetch(`${baseUrl}/service/v1/${id}`);
                if (!resServices.ok) throw new Error(`Error ${resServices.status}: ${resServices.statusText}`);
                const dataServices = await resServices.json();
                setServices(dataServices);

                // Fetch hotel rooms
                const resRooms = await fetch(`${baseUrl}/room/v1/hotel/${id}`);
                if (!resRooms.ok) throw new Error(`Error ${resRooms.status}: ${resRooms.statusText}`);
                const dataRooms = await resRooms.json();
                setRooms(dataRooms.room ?? []);
            } catch (err: any) {
                setError(err.message ?? 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const checkInDate = searchParams.get('checkInDate');
        const checkOutDate = searchParams.get('checkOutDate');
        const maxGuests = searchParams.get('maxGuests');

        if (checkInDate && checkOutDate) {
            setDateRange([
                {
                    startDate: new Date(checkInDate),
                    endDate: new Date(checkOutDate),
                    key: 'selection',
                },
            ]);

            if (maxGuests) {
                setNumPeople(Number(maxGuests));
            }

            fetchRoomsByAvailability().then(() => {
                setTimeout(() => {
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            });
        }
    }, [searchParams]);

    const fetchRoomsByAvailability = async () => {
        setLoading(true);
        setError(null);
        try {
            const checkIn = dateRange[0].startDate ? formatISO(dateRange[0].startDate, { representation: 'date' }) : undefined;
            const checkOut = dateRange[0].endDate ? formatISO(dateRange[0].endDate, { representation: 'date' }) : undefined;

            const queryParams = new URLSearchParams({
                hotelId: id,
            });
            if (checkIn) queryParams.append('checkIn', checkIn);
            if (checkOut) queryParams.append('checkOut', checkOut);

            const url = `${baseUrl}/room/v1/by-hotel?${queryParams.toString()}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            setHasSearched(true);
            const data = await res.json();
            setRooms(data.room ?? data);
        } catch (err: any) {
            setError(err.message ?? 'Error desconocido al cargar disponibilidad');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!hotel) return <p>No se encontró el hotel.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-12 scroll-smooth">
            {/* Cabecera */}
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{hotel.name}</h1>
                <StarRating rating={hotel.stars ?? 0} />
                <p className="text-gray-500">{hotel.address}, {hotel.city}, {hotel.country}</p>
            </div>

            {/* Galería */}
            <div>
                <HotelGallery images={hotel.images ?? []} />
            </div>

            {/* Descripción y mapa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t pt-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sobre este hotel</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">{hotel.description}</p>
                    <HotelAmenities services={services} />
                </div>

                <div className="h-72 rounded-lg overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
                    <iframe
                        title="Mapa del hotel"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(`${hotel.address}, ${hotel.city}, ${hotel.country}`)}&output=embed`}
                    />
                </div>
            </div>

            {/* Buscador */}
            <div className="flex flex-wrap gap-6 items-end border-t pt-8">
                <div className="w-full max-w-md">
                    <DateRangePicker
                        dateRange={dateRange}
                        onChange={(newRange) => setDateRange([{ ...newRange, key: 'selection' }])}
                    />
                </div>

                <div className="w-full md:w-auto">
                    <QuantityInput
                        icon={<Users />}
                        min={1}
                        max={5}
                        defaultValue={1}
                        onChange={(numPeople) => setNumPeople(numPeople)}
                        tooltipKey="peopleCount"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={fetchRoomsByAvailability}
                        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold px-5 py-2 rounded-lg shadow"
                    >
                        Ver disponibilidad
                    </button>
                </div>
            </div>

            {/* Tabla de habitaciones */}
            <div className="pt-8" ref={tableRef}>
                <h2 className="text-2xl font-semibold mb-4">
                    {hasSearched ? `Habitaciones disponibles · ${formattedRange}` : 'Nuestras habitaciones'}
                </h2>
                {rooms.length === 0 ? (
                    <p className="text-gray-500">No hay habitaciones disponibles.</p>
                ) : (
                    <div className="max-h-96 overflow-y-auto border rounded-lg shadow-lg">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="text-left px-4 py-3 border-b">Detalles</th>
                                    <th className="text-center px-4 py-3 border-b">Máx. huéspedes</th>
                                    <th className="text-center px-4 py-3 border-b">Disponibilidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => {
                                    const isAvailable = room.available === true;
                                    return (
                                        <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-3 border-b align-top">
                                                <p className="font-semibold text-gray-900">{room.type}</p>
                                                <p className="text-gray-600">Precio por noche: <span className="font-medium">{formatPrice(room.pricePerNight)}</span></p>
                                                <p className="text-gray-600">Nº habitación: {room.roomNumber}</p>
                                            </td>
                                            <td className="text-center px-4 border-b align-middle">
                                                <div className="inline-flex items-center justify-center gap-1">
                                                    {Array.from({ length: room.maxGuests }).map((_, i) => (
                                                        <Users key={i} className="w-5 h-5 text-blue-600" />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-center px-4 border-b align-middle">
                                                {isAvailable ? (
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/hotel/${hotel.id}/reserve?roomId=${room.id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&maxGuests=${room.maxGuests}`
                                                            )
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-semibold px-4 py-1 rounded"
                                                    >
                                                        Reservar
                                                    </button>
                                                ) : (
                                                    <span className="text-red-500 font-semibold">❌ No disponible</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reseñas */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold mb-6">Opiniones de huéspedes</h2>
                <HotelReviews hotelId={id} />
            </div>
        </div>
    );
}