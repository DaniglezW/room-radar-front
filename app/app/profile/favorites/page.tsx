'use client';

import FavoriteHotelsList from '@/app/profile/favorites/FavoriteHotelsList';
import { fetchUserFavoritesList } from '@/app/services/favoriteService';
import { Hotel } from '@/app/types/Hotel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Favorites() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadFavorites = async () => {
            const data = await fetchUserFavoritesList();
            setHotels(data);
            setLoading(false);
        };
        loadFavorites();
    }, []);

    if (loading) {
        return <p className="text-center text-lg text-gray-500 mt-6">Cargando hoteles favoritos...</p>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Mis hoteles favoritos</h1>
            <button
                onClick={() => router.push('/profile')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
                ⬅ Volver al perfil
            </button>
            <FavoriteHotelsList hotels={hotels} />
        </div>
    );
}
