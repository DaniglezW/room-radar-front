'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReservationDTO {
    id: number;
    hotelName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    guestNames?: string;
    totalPrice?: number;
    paymentMethod?: string;
    status?: string;
    confirmationCode?: string;
    mainImage?: string | null;
    hotelImage?: string | null;
}

export default function ActiveReservations() {
    const [reservations, setReservations] = useState<ReservationDTO[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getCookie = (name: string) => {
            const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
            return match ? match[2] : null;
        };
        const token = getCookie('token');
        if (!token) {
            router.push('/profile');
            return;
        }

        fetch(`http://localhost:8082/api/reservation/v1/me?status=CONFIRMED`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('Error fetching reservations');
                const data = await res.json();
                console.log(data);
                setReservations(data.reservation || []);
            })
            .catch(() => router.push('/profile'));
    }, [router]);

    if (!reservations || reservations.length === 0) {
        return <p className="text-center mt-8">No tienes próximas reservas.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <button
                onClick={() => router.push('/profile')}
                className="bg-gray-500 mb-4 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
                ⬅ Volver al perfil
            </button>

            {reservations.map((res) => {
                const checkIn = res.checkInDate ? new Date(res.checkInDate) : new Date();
                const checkOut = res.checkOutDate ? new Date(res.checkOutDate) : new Date();
                const nights = Math.max(differenceInDays(checkOut, checkIn), 1);

                return (
                    <div key={res.id} className="flex gap-4 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative w-40 h-32 flex-shrink-0">
                            {res.hotelImage ? (
                                <Image src={res.hotelImage} alt={res.hotelName || 'Hotel'} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">{res.hotelName || 'Hotel desconocido'}</h3>
                                <p className="text-gray-500 text-sm">
                                    {format(checkIn, "d 'de' MMMM yyyy", { locale: es })} - {format(checkOut, "d 'de' MMMM yyyy", { locale: es })} ({nights} {nights > 1 ? 'noches' : 'noche'})
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Huéspedes: {res.guestNames ? res.guestNames.split(',').join(', ') : 'No especificado'}
                                </p>

                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="font-semibold">Total: {(res.totalPrice || 0).toFixed(2)}€</span>
                                <span className="text-sm text-gray-500">{res.paymentMethod || 'N/A'}</span>
                            </div>
                            <div className="mt-2 text-sm text-blue-600 font-medium">
                                Código: {res.confirmationCode || 'N/A'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
