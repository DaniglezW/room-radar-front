'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
        if (user.profilePicture) {
            return (
                <Image
                    src={`data:image/jpeg;base64,${user.profilePicture}`}
                    alt="User"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                />
            );
        }

        if (user.googleProfilePictureUrl) {
            return (
                <Image
                    src={user.googleProfilePictureUrl}
                    alt="User"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                />
            );
        }

        return (
            <div className="w-[120px] h-[120px] bg-gray-300 text-blue-900 text-4xl font-bold rounded-full flex items-center justify-center shadow-lg">
                {user.fullName?.[0] ?? 'U'}
            </div>
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user!, [e.target.name]: e.target.value });
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex flex-col items-center mb-6">
                {renderUserAvatar(user)}
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user.fullName}</h2>
                <p className="text-gray-500 text-sm">
                    Usuario desde el {format(new Date(user.createdAt), "d 'de' MMMM yyyy", { locale: es })}
                </p>
            </div>

            <form className="grid gap-6 bg-white p-6 rounded-xl shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={user.phoneNumber || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Puedes agregar aquí un botón para guardar cambios si tienes un endpoint */}
                {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Guardar cambios</button> */}
            </form>
        </div>
    );
}