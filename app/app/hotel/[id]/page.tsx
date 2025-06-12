'use client';

import { use, useEffect, useState } from 'react';
import HotelGallery from '@/app/components/HotelGallery';
import StarRating from '@/app/components/StarRating';
import { Hotel } from '@/app/types/Hotel';
import { Service } from '@/app/types/Service';
import HotelAmenities from '@/app/components/HotelAmenities';

type HotelImage = {
    id: number;
    imageData: string | null;
    description?: string;
    isMain: boolean;
};

export default function HotelPage({ params }: { params: Promise<{ id: string }> }) {
    // "use" desenvuelve la promesa params
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setError('ID de hotel inválido');
            setLoading(false);
            return;
        }

        const fetchHotelAndServices = async () => {
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
            } catch (err: any) {
                setError(err.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchHotelAndServices();
    }, [id]);

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
                {/* Columna izquierda: contenido textual */}
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
                    <p className="text-gray-800 mb-4">{hotel.description}</p>

                    <HotelAmenities services={services} />
                </div>

                {/* Columna derecha: Mapa */}
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
        </div>
    );
}