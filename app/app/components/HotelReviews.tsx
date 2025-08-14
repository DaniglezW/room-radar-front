'use client';

import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Image from 'next/image';

type Review = {
    review: {
        id: number;
        rating: number;
        comment: string;
        createdAt: string;
    };
    user: {
        id: number;
        fullName: string;
        profilePicture: string | null;
    };
};

export default function HotelReviews({ hotelId }: Readonly<{ hotelId: string }>) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${baseUrl}/review/v1/${hotelId}`);
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

                const data = await res.json();
                setReviews(data.reviews ?? []);
            } catch (err: any) {
                setError(err.message ?? 'Error al cargar reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [hotelId]);

    if (loading) return <p>Cargando reseñas...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (reviews.length === 0) return <p>No hay reseñas aún.</p>;

    return (
        <div className="mt-10">
            <div className='flex space-x-6'>
                <h2 className="text-2xl font-semibold mb-4">Reseñas ({reviews.length})</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
            </div>

            <div className="space-y-6">
                {reviews.map(({ review, user }) => (
                    <div key={review.id} className="bg-white p-4 rounded shadow">
                        <div className="flex items-center mb-2">
                            {user.profilePicture ? (
                                <Image
                                    src={`data:image/jpeg;base64,${user.profilePicture}`}
                                    alt="User"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover mr-3"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: '#f8b9fe', border: '1px solid #ccc', color: '#6b21a8', fontWeight: 'bold', fontSize: '1rem', userSelect: 'none', }}>
                                    {user.fullName?.[0]?.toUpperCase() ?? 'U'}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold">{user.fullName}</p>
                                <StarRating rating={review.rating} />
                            </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
