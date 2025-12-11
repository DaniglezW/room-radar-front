'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { criteriaIcons } from '../utils/criteriaIcons';

type ShowReview = {
    id: number;
    overallRating: number;
    comment: string;
    createdAt: string;
    username: string;
    profileImg: string | null;
};

type Criteria = {
    id: number;
    name: string;
};

export default function HotelReviews({ hotelId }: Readonly<{ hotelId: string }>) {
    const [reviews, setReviews] = useState<ShowReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [canReview, setCanReview] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [criteria, setCriteria] = useState<Criteria[]>([]);
    const [formData, setFormData] = useState({
        comment: '',
        overallRating: 0,
        criteriaRatings: [] as { criteriaId: number; rating: number }[],
    });

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    const getCookie = (name: string) => {
        const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
        return match ? match[2] : null;
    };

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

    useEffect(() => {
        const checkCanReview = async () => {
            const token = getCookie('token');
            if (!token) return;

            try {
                const res = await fetch(
                    `${baseUrl}/review/v1/is-allowed?hotelId=${hotelId}&token=${token}`
                );

                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

                const data = await res.json();
                setCanReview(data.canReview ?? false);
            } catch (err) {
                console.error('Error comprobando si puede reseñar:', err);
            }
        };

        checkCanReview();
    }, [hotelId]);

    const openModal = async () => {
        setIsModalOpen(true);

        try {
            const res = await fetch(`${baseUrl}/review/v1/criteria`);
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data: Criteria[] = await res.json();
            setCriteria(data);

            // inicializamos los valores de criterios
            setFormData((prev) => ({
                ...prev,
                criteriaRatings: data.map((c) => ({ criteriaId: c.id, rating: 0 })),
            }));
        } catch (err) {
            console.error('Error cargando criterios:', err);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            comment: '',
            overallRating: 0,
            criteriaRatings: [],
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'overallRating' ? Number(value) : value,
        }));
    };

    const handleCriteriaChange = (id: number, value: number) => {
        setFormData((prev) => {
            const updatedCriteria = prev.criteriaRatings.map((c) =>
                c.criteriaId === id ? { ...c, rating: value } : c
            );

            const validRatings = updatedCriteria.map((c) => c.rating).filter((r) => r > 0);
            const avg =
                validRatings.length > 0
                    ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length
                    : 0;

            return {
                ...prev,
                criteriaRatings: updatedCriteria,
                overallRating: avg,
            };
        });
    };

    const handleSubmit = async () => {
        const token = getCookie('token');
        if (!token) {
            alert('Debes iniciar sesión para enviar reseñas');
            return;
        }

        try {
            const res = await fetch(`${baseUrl}/review/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token, // el backend espera @RequestHeader("Authorization")
                },
                body: JSON.stringify({
                    hotelId: Number(hotelId),
                    ...formData,
                }),
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const newReview = await res.json();
            setReviews((prev) => [newReview, ...prev]);
            closeModal();
        } catch (err) {
            console.error('Error enviando reseña:', err);
            alert('Error al enviar reseña');
        }
    };

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

            {/* Botón para dejar reseña solo si el backend lo permite */}
            {canReview && (
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
                >
                    Escribir reseña
                </button>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Nueva Reseña</h3>

                        <textarea
                            name="comment"
                            placeholder="Tu comentario"
                            value={formData.comment}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2 mb-3"
                        />

                        <div className="space-y-4 mb-4">
                            {criteria.map((c) => {
                                const current = formData.criteriaRatings.find((cr) => cr.criteriaId === c.id);

                                return (
                                    <div key={c.id} className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2 pr-1">
                                            <label className="font-semibold">{c.name}</label>
                                            {criteriaIcons[c.name] ?? null}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                step="1"
                                                value={current ? current.rating : 0}
                                                onChange={(e) => handleCriteriaChange(c.id, Number(e.target.value))}
                                                className="w-full accent-blue-600"
                                            />
                                            <span className="w-8 text-center font-medium text-gray-700">
                                                {current ? current.rating : 0}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
