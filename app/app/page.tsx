"use client";
import { useState } from "react";
import HomeBody from "./components/HomeBody";
import SearchBar from "./components/SearchBar";
import { Hotel } from "./types/Hotel";

export default function Page() {
  const [searchedHotels, setSearchedHotels] = useState<Hotel[] | null>(null);
  const [searchParams, setSearchParams] = useState<{
    checkInDate: string | null;
    checkOutDate: string | null;
    maxGuests: number | null;
  }>({
    checkInDate: null,
    checkOutDate: null,
    maxGuests: null,
  });

  const handleSearch = (
    results: Hotel[],
    params: { checkInDate: string; checkOutDate: string; maxGuests: number }
  ) => {
    setSearchedHotels(results);
    setSearchParams(params);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <SearchBar onSearchResults={handleSearch} />
      <HomeBody checkInDate={searchParams.checkInDate} checkOutDate={searchParams.checkOutDate} maxGuests={searchParams.maxGuests} searchedHotels={searchedHotels} />
    </main>
  );
}
