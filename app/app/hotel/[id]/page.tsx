'use client';

import { use, useEffect, useState } from 'react';
import HotelGallery from '@/app/components/HotelGallery';
import StarRating from '@/app/components/StarRating';
import { Hotel } from '@/app/types/Hotel';
import { Service } from '@/app/types/Service';
import HotelAmenities from '@/app/components/HotelAmenities';
import HotelReviews from '@/app/components/HotelReviews';
import { DateRange } from 'react-date-range';
import DateRangePicker from '@/app/components/DateRangePicker';
import QuantityInput from '@/app/components/QuantityInput';
import { Users } from 'lucide-react';
import { formatISO } from 'date-fns';

type Room = {
    id: number;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    available: boolean;
    maxGuests: number;
    images: any[];
};

export default function HotelPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [numPeople, setNumPeople] = useState(1);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            key: 'selection',
        },
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

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
            const data = await res.json();
            setRooms(data.room ?? data); // Ajusta según estructura JSON
        } catch (err: any) {
            setError(err.message ?? 'Error desconocido al cargar disponibilidad');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando hotel...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!hotel) return <p>No se encontró el hotel.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <StarRating rating={hotel.stars ?? 0} />
                <p className="text-gray-600 mt-1">
                    {hotel.address}, {hotel.city}, {hotel.country}
                </p>
            </div>

            <div className="mb-10">
                <HotelGallery images={hotel.images ?? []} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
                    <p className="text-gray-800 mb-4">{hotel.description}</p>

                    <HotelAmenities services={services} />
                </div>

                <div className="h-72 rounded-lg overflow-hidden shadow">
                    <iframe
                        title="Mapa del hotel"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                            `${hotel.address}, ${hotel.city}, ${hotel.country}`
                        )}&output=embed`}
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-wrap gap-6 items-end mt-10">
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

                {/* Botón para ver disponibilidad */}
                <div className="w-full md:w-auto">
                    <button
                        onClick={fetchRoomsByAvailability}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full md:w-auto"
                    >
                        Ver Disponibilidad
                    </button>
                </div>
            </div>

            {/* Sección habitaciones estilo tabla */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Habitaciones</h2>
                {rooms.length === 0 ? (
                    <p>No hay habitaciones disponibles.</p>
                ) : (
                    <div className="max-h-96 overflow-y-auto border rounded-lg shadow">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="text-left px-4 py-2 border-b">Detalles</th>
                                    <th className="text-center px-4 py-2 border-b">Máximo de huéspedes</th>
                                    <th className="text-center px-4 py-2 border-b">Disponibilidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => {
                                    const isAvailable = room.available === true;
                                    return (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 border-b align-top">
                                                <p className="font-semibold text-gray-800">{room.type}</p>
                                                <p className="text-gray-600">Precio por noche: <span className="font-medium">€{room.pricePerNight.toFixed(2)}</span></p>
                                                <p className="text-gray-600">Nº habitación: {room.roomNumber}</p>
                                            </td>
                                            <td className="text-center px-4 border-b align-middle">
                                                <div className="inline-flex items-center justify-center gap-1 h-full">
                                                    {Array.from({ length: room.maxGuests }).map((_, i) => (
                                                        <Users key={i} className="w-5 h-5 text-blue-600" />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">nu máx.</span>
                                                </div>
                                            </td>
                                            <td className="text-center px-4 border-b align-middle">
                                                {isAvailable ? (
                                                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded">
                                                        Reservar
                                                    </button>
                                                ) : (
                                                    <div>
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                            No disponible para las fechas seleccionadas
                                                        </div>
                                                        <span className="text-red-500 font-semibold flex items-center justify-center gap-1">
                                                            ❌ No disponible
                                                        </span>
                                                    </div>
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

            <HotelReviews hotelId={id} />
        </div>
    );
}