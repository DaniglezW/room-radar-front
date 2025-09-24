'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type ShowReview = {
    id: number;
    overallRating: number;
    comment: string;
    createdAt: string;
    username: string;
    profileImg: string | null; // convertimos el byte[] a Base64 en el backend si es necesario
};

export default function HotelReviews({ hotelId }: Readonly<{ hotelId: string }>) {
    const [reviews, setReviews] = useState<ShowReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${baseUrl}/review/v1/${hotelId}`);
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

                const data = await res.json();
                // Asegurarnos de que profileImg sea null si no viene
                const formattedReviews = (data.reviews ?? []).map((r: any) => ({
                    ...r,
                    profileImg: r.profileImg ?? null,
                }));
                setReviews(formattedReviews);
            } catch (err: any) {
                setError(err.message ?? 'Error al cargar reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [hotelId]);

    const renderUserAvatar = (review: ShowReview) => {
        if (review.profileImg) {
            return (
                <Image
                    src={`data:image/jpeg;base64,${review.profileImg}`}
                    alt={review.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                />
            );
        }

        return (
            <div className="w-10 h-10 bg-blue-100 text-blue-900 font-bold rounded-full flex items-center justify-center">
                {review.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
        );
    };

    if (loading) return <p>Cargando reseñas...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (reviews.length === 0) return <p>Sin reseñas.</p>;

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6">Reseñas ({reviews.length})</h2>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                {renderUserAvatar(review)}
                                <span className="font-semibold text-gray-800">{review.username}</span>
                            </div>
                            <span
                                className="font-bold px-3 py-1 rounded-full text-white"
                                style={{ backgroundColor: '#2F6FEB' }}
                            >
                                {review.overallRating.toFixed(1)}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
