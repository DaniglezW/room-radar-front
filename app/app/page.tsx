"use client";
import { useState } from "react";
import HomeBody from "./components/HomeBody";
import SearchBar from "./components/SearchBar";
import { Hotel } from "./types/Hotel";
import { HotelWithRating } from "./types/hotelSearched";

export default function Page() {
  const [searchedHotels, setSearchedHotels] = useState<HotelWithRating[] | null>(null);
  const [searchParams, setSearchParams] = useState<{
    checkInDate: string | null;
    checkOutDate: string | null;
    maxGuests: number | null;
    serviceIds: number[];
  }>({
    checkInDate: null,
    checkOutDate: null,
    maxGuests: null,
    serviceIds: []
  });

  const handleSearch = (
    results: HotelWithRating[],
    params: { checkInDate: string; checkOutDate: string; maxGuests: number, serviceIds: number[] }
  ) => {
    setSearchedHotels(results);
    setSearchParams(params);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <SearchBar onSearchResults={handleSearch} />
      <HomeBody checkInDate={searchParams.checkInDate} checkOutDate={searchParams.checkOutDate} maxGuests={searchParams.maxGuests} serviceIds={searchParams.serviceIds} searchedHotels={searchedHotels} />
    </main>
  );
}
