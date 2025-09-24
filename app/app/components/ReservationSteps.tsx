"use client";

import 'react-phone-number-input/style.css';

import { useState } from "react";
import { Room } from "../types/Room";
import { usePaymentInputs } from 'react-payment-inputs';
import PhoneInput from 'react-phone-number-input';
import { UserDTO } from '../types/User';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '@/context/CurrencyContext';
import DateRangePicker from './DateRangePicker';
import { useRouter } from 'next/navigation';

interface Props {
    hotelId: string;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
}

export default function ReservationSteps({ hotelId, room, checkInDate, checkOutDate, guests }: Readonly<Props>) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const router = useRouter();
    const { formatPrice } = useCurrency();

    // Hooks de react-payment-inputs
    const { getCardNumberProps, getExpiryDateProps, getCVCProps, meta } = usePaymentInputs();

    const nights = Math.max(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24),
        1
    );

    const totalPrice = nights * room.pricePerNight;

    // Validación de campos antes de avanzar
    const canProceedStep1 = () => formData.name && formData.email && formData.phone;
    const canProceedStep2 = () => formData.cardNumber && formData.expiry && formData.cvv && formData.name;

    const nextStep = () => {
        if (step === 1 && !canProceedStep1()) {
            toast('Completa los datos de los huéspedes', {
                icon: '⚠️',
            });
            return;
        }
        if (step === 2 && !canProceedStep2()) {
            toast('Rellena los datos de pago', {
                icon: '⚠️',
            });
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Funciones para usuario logueado
    const getTokenFromCookie = () => {
        const match = /(^| )token=([^;]+)/.exec(document.cookie);
        return match ? match[2] : null;
    };

    const isUserLogged = () => !!getTokenFromCookie();

    const fillUserData = async () => {
        if (!isUserLogged()) {
            alert("Debes iniciar sesión para usar tus datos");
            return;
        }
        try {
            const token = getTokenFromCookie();
            const res = await fetch("http://localhost:8082/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            if (!res.ok) throw new Error("Error al obtener usuario");
            const data = await res.json();
            const user: UserDTO = data.user;
            setFormData(prev => ({
                ...prev,
                name: user.fullName,
                email: user.email,
                phone: user.phoneNumber,
            }));
        } catch (err) {
            console.error(err);
            alert("No se pudieron cargar los datos del usuario");
        }
    };

    const handleConfirm = async () => {
        const payload = {
            roomId: room.id,
            checkInDate,
            checkOutDate,
            guests,
            guestNames: [formData.name],
            guestEmail: formData.email,
            guestPhone: formData.phone,
            cardNumber: formData.cardNumber,
            paymentMethod: meta.cardType ? meta.cardType.displayName.toUpperCase() : "CARD"
        };

        try {
            const getCookie = (name: string) => {
                const match = RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
                return match ? match[2] : null;
            };
            const token = getCookie('token');
            const res = await fetch("http://localhost:8082/api/reservation/v1", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success('Reserva confirmada');
            } else {
                toast.error('Error al reservar');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error al reservar');
        }
    };

    return (
        <div>
            {/* Paso 1: Datos del huésped */}
            {step === 1 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Paso 1: Datos del huésped</h2>
                    <button
                        onClick={fillUserData}
                        className="mb-4 flex items-center gap-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        <User /> Usar mis datos
                    </button>
                    {Array.from({ length: guests }, (_, i) => (
                        <div key={i} className="space-y-2 border-b pb-4 mb-4">
                            <input
                                name={`guest_${i}_name`}
                                placeholder={`Nombre del huésped ${i + 1}`}
                                className="w-full p-3 border rounded"
                                value={i === 0 ? formData.name : ""}
                                onChange={handleChange}
                            />
                            {i === 0 && (
                                <>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                    />
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Teléfono
                                        </label>
                                        <PhoneInput
                                            id="phone"
                                            international
                                            defaultCountry="ES"
                                            value={formData.phone || ''}
                                            onChange={(value: any) => setFormData({ ...formData, phone: value || '' })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Paso 2: Pago */}
            {step === 2 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Paso 2: Pago</h2>
                    <div className="space-y-4">
                        <input
                            {...getCardNumberProps({
                                onChange: (e: any) => setFormData(prev => ({ ...prev, cardNumber: e.target.value })),
                            })}
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Número de tarjeta"
                        />
                        <input
                            {...getExpiryDateProps({
                                onChange: (e: any) => setFormData(prev => ({ ...prev, expiry: e.target.value })),
                            })}
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                        />
                        <input
                            {...getCVCProps({
                                onChange: (e: any) => setFormData(prev => ({ ...prev, cvv: e.target.value })),
                            })}
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="CVV"
                        />
                        <input
                            type="text"
                            placeholder="Nombre en la tarjeta"
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                </>
            )}

            {/* Paso 3: Confirmación */}
            {step === 3 && (
                <div className="bg-white shadow-md rounded-xl p-6 space-y-6 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Confirmar reserva</h2>

                    <div className="border-b pb-4 space-y-2">
                        <p className="text-gray-700"><span className="font-semibold">Habitación:</span> {room.type} (Nº {room.id})</p>
                        <p className="text-gray-700"><span className="font-semibold">Fechas:</span> {checkInDate} - {checkOutDate} ({nights} noches)</p>
                    </div>

                    {/* DateRangePicker informativo */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <DateRangePicker
                            dateRange={[
                                {
                                    startDate: new Date(checkInDate),
                                    endDate: new Date(checkOutDate),
                                    key: 'selection',
                                },
                            ]}
                            onChange={() => { }}
                        />
                    </div>

                    <div className="border-b pb-4 space-y-2">
                        <p className="text-gray-700"><span className="font-semibold">Huéspedes:</span> {guests}</p>
                    </div>

                    <div className="text-center">
                        <p className="text-xl font-semibold text-green-700">Total: {formatPrice(totalPrice)}</p>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Confirmar Reserva
                    </button>
                </div>
            )}

            {/* Navegación de pasos */}
            <div className="flex justify-between mt-4">
                {step > 1 && <button onClick={prevStep} className="px-4 py-2 border rounded">Atrás</button>}
                {step < 3 && <button onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Siguiente</button>}
                {/* Botón cancelar */}
                <button
                    onClick={() => {
                        router.push(`/hotel/${hotelId}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&maxGuests=${guests}`);
                    }}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
