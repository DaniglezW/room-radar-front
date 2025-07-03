'use client';

import Image from 'next/image';

type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'FAMILY';

type RoomImage = {
    id: number;
    url: string; // suponiendo que tienes una url
};

type Room = {
    id: number;
    roomNumber: string;
    type: RoomType;
    pricePerNight: number;
    available: boolean;
    maxGuests: number;
    images: RoomImage[];
};

export default function HotelRooms({ rooms }: Readonly<{ rooms: Room[] }>) {
    if (rooms.length === 0) return <p>No hay habitaciones disponibles.</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Habitaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rooms.map(room => (
                    <div
                        key={room.id}
                        className={`border rounded p-4 shadow ${room.available ? 'border-green-400' : 'border-red-400 opacity-60'
                            }`}
                    >
                        <h3 className="font-bold mb-2">
                            Habitación {room.roomNumber} - {room.type}
                        </h3>
                        <p>Precio por noche: ${room.pricePerNight.toFixed(2)}</p>
                        <p>Máximo huéspedes: {room.maxGuests}</p>
                        <p className={`font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                            {room.available ? 'Disponible' : 'No disponible'}
                        </p>

                        {room.images.length > 0 && (
                            <div className="mt-2">
                                <Image
                                    src={room.images[0].url}
                                    alt={`Imagen habitación ${room.roomNumber}`}
                                    width={200}
                                    height={150}
                                    className="rounded"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
