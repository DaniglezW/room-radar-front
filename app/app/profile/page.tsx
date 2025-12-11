'use client';

import 'react-phone-number-input/style.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, Clock, Heart, User } from 'lucide-react';

interface UserDTO {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    profilePicture: string | null;
    googleProfilePictureUrl: string | null;
    createdAt: string;
}

export default function Profile() {
    const [user, setUser] = useState<UserDTO | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_AUTH_URL + '/auth/me', {
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) {
                    router.push('/app');
                    return;
                }
                const data = await res.json();
                setUser(data.user);
            })
            .catch(() => {
                router.push('/app');
            });
    }, [router]);

    const renderUserAvatar = (user: UserDTO) => {
        const avatarSrc = user.profilePicture
            ? `data:image/jpeg;base64,${user.profilePicture}`
            : user.googleProfilePictureUrl || null;

        return (
            <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                {avatarSrc ? (
                    <Image
                        src={avatarSrc}
                        alt="User"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 text-blue-900 text-5xl font-bold flex items-center justify-center">
                        {user.fullName?.[0] ?? 'U'}
                    </div>
                )}
            </div>
        );
    };

    if (!user) return null;

    const buttons = [
        { label: 'Favoritos', icon: <Heart size={28} />, href: '/profile/favorites', color: 'bg-red-500', hover: 'hover:bg-red-600' },
        { label: 'Próximas reservas', icon: <CalendarDays size={28} />, href: '/profile/reservations/active', color: 'bg-green-600', hover: 'hover:bg-green-700' },
        { label: 'Detalles del perfil', icon: <User size={28} />, href: '/profile/details', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 mt-20">
            <div className="flex flex-col items-center mb-6">
                {renderUserAvatar(user)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {buttons.map((btn) => (
                    <div
                        key={btn.label}
                        onClick={() => router.push(btn.href)}
                        className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl shadow-lg text-white cursor-pointer ${btn.color} ${btn.hover} transition`}
                    >
                        {btn.icon}
                        <span className="font-semibold">{btn.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}