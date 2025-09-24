'use client';

import 'react-phone-number-input/style.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import { updateUserProfile } from '../../services/userService';

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

export default function ProfileDetails() {
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [user, setUser] = useState<UserDTO | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_AUTH_URL + '/auth/me', {
            credentials: 'include',
        })
            .then(async res => {
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

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePictureFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () => {
                setUser({ ...user!, profilePicture: (reader.result as string).split(',')[1] });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (user.fullName.length > 50) {
            alert('El nombre es demasiado largo (máx 50 caracteres)');
            return;
        }

        if (user.phoneNumber && !/^\+\d{9,15}$/.test(user.phoneNumber)) {
            alert('Número inválido. Debe empezar con + y tener al menos 9 dígitos.');
            return;
        }

        let profilePictureBase64;
        if (profilePictureFile) {
            profilePictureBase64 = await fileToBase64(profilePictureFile);
        }

        try {
            const updatedUser = await updateUserProfile({
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                profilePicture: profilePictureBase64,
            });
            setUser(updatedUser);
            toast.success("Perfil modificado");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const renderUserAvatar = (user: UserDTO) => {
        const avatarSrc = user.profilePicture
            ? `data:image/jpeg;base64,${user.profilePicture}`
            : user.googleProfilePictureUrl || null;

        return (
            <div
                className="relative w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {avatarSrc ? (
                    <Image src={avatarSrc} alt="User" fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-300 text-blue-900 text-5xl font-bold flex items-center justify-center">
                        {user.fullName?.[0] ?? 'U'}
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user!, [e.target.name]: e.target.value });
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button
                onClick={() => router.push('/profile')}
                className="bg-gray-500 mb-4 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
                ⬅ Volver al perfil
            </button>
            <div className="flex flex-col items-center mb-6">
                {renderUserAvatar(user)}
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user.fullName}</h2>
                <p className="text-gray-500 text-sm">
                    Usuario desde el {format(new Date(user.createdAt), "d 'de' MMMM yyyy", { locale: es })}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 bg-white p-6 rounded-xl shadow-md">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        maxLength={50}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <PhoneInput
                        id="phoneNumber"
                        international
                        defaultCountry="ES"
                        value={user.phoneNumber || ''}
                        onChange={(value: any) => setUser({ ...user, phoneNumber: value || '' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}
