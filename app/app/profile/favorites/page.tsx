'use client';

import LoadingSpinner from '@/app/components/LoadingSpinner';
import FavoriteHotelsList from '@/app/profile/favorites/FavoriteHotelsList';
import { fetchUserFavoritesList } from '@/app/services/favoriteService';
import { Favorite } from '@/app/types/Favorite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Favorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadFavorites = async () => {
            const data = await fetchUserFavoritesList();
            setFavorites(data);
            setLoading(false);
        };
        loadFavorites();
    }, []);

    if (loading) return <LoadingSpinner />;

    const hotels = favorites.map(fav => fav.hotel);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Mis hoteles favoritos</h1>
            <button
                onClick={() => router.push('/profile')}
                className="bg-gray-500 mb-4 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
                ⬅ Volver al perfil
            </button>
            <FavoriteHotelsList hotels={hotels} />
        </div>
    );
}
