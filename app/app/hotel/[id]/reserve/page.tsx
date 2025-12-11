"use client";

import { useEffect, useState } from "react";
import ReservationSteps from "@/app/components/ReservationSteps";
import ReservationSummary from "@/app/components/ReservationSummary";
import { Hotel } from "@/app/types/Hotel";
import { Room } from "@/app/types/Room";
import { useSearchParams, useParams } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function ReservePage() {
    const { id } = useParams<{ id: string }>();
    const searchParams = useSearchParams();

    const roomId = searchParams.get("roomId") || "";
    const checkInDate = searchParams.get("checkInDate") || "";
    const checkOutDate = searchParams.get("checkOutDate") || "";
    const maxGuests = parseInt(searchParams.get("maxGuests") || "1", 10);

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [room, setRoom] = useState<Room | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    useEffect(() => {
        if (!id || !roomId) return;

        const fetchData = async () => {
            const resHotel = await fetch(`${baseUrl}/hotel/v1/${id}`);
            const dataHotel = await resHotel.json();
            setHotel(dataHotel.hotel);

            const resRoom = await fetch(`${baseUrl}/room/v1/${roomId}`);
            const dataRoom = await resRoom.json();
            setRoom(dataRoom.room);
        };

        fetchData();
    }, [id, roomId]);

    if (!hotel || !room) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded shadow">
                <ReservationSteps
                    hotelId={id}
                    room={room}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    guests={maxGuests}
                />
            </div>

            <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded shadow sticky top-4 h-max">
                <ReservationSummary
                    hotel={hotel}
                    room={room}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    guests={maxGuests}
                />
            </div>
        </div>
    );
}