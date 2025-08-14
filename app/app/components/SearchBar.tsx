"use client";
import { Users } from "lucide-react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateRangePicker from "./DateRangePicker";
import { useTranslation } from 'react-i18next';
import QuantityInput from "./QuantityInput";
import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";
import { Location } from "../types/Location";
import { searchHotels } from "../services/hotelService";
import { Hotel } from "../types/Hotel";

interface SearchBarProps {
  onSearchResults: (
    results: Hotel[],
    params: { checkInDate: string; checkOutDate: string; maxGuests: number }
  ) => void;
}

export default function SearchBar({ onSearchResults }: Readonly<SearchBarProps>) {
  const { t } = useTranslation();

  const [numPeople, setNumPeople] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const request = {
      name: searchText,
      checkIn: dateRange[0].startDate.toISOString().split("T")[0],
      checkOut: dateRange[0].endDate.toISOString().split("T")[0],
      maxGuests: numPeople,
    };

    try {
      const results = await searchHotels(request);
      console.log("Hoteles encontrados:", results);
      onSearchResults(results, {
        checkInDate: request.checkIn,
        checkOutDate: request.checkOut,
        maxGuests: request.maxGuests,
      });
    } catch (error) {
      console.error("Error buscando hoteles:", error);
      onSearchResults([], {
        checkInDate: request.checkIn,
        checkOutDate: request.checkOut,
        maxGuests: request.maxGuests,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">

        {/* Input con autocompletado */}
        <div className="flex-1 w-full">
          <LocationAutocomplete
            value={searchText}
            onChange={(val) => {
              setSearchText(val);
            }}
            onSelect={(item) => {
              setSelectedLocation(item);
              setSearchText(item.name);
            }}
          />
        </div>

        {/* Fecha */}
        <div className="flex-1 w-full">
          <DateRangePicker
            dateRange={dateRange}
            onChange={(newRange) =>
              setDateRange([{ ...newRange, key: "selection" }])
            }
          />
        </div>

        {/* Personas */}
        <div className="w-full md:w-auto">
          <QuantityInput
            icon={<Users />}
            min={1}
            max={5}
            defaultValue={1}
            onChange={(numPeople) => setNumPeople(numPeople)}
            tooltipKey="peopleCount"
          />
        </div>

        {/* Botón */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleSearch}
            disabled={loading}  // <-- botón deshabilitado mientras carga
            className={`bg-[#0d6efd] text-white px-6 py-2 rounded-lg transition w-full md:w-auto
              ${loading ? "cursor-not-allowed opacity-70" : "hover:bg-blue-600"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Buscando...
              </span>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
