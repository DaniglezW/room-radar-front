"use client";
import { Eraser, SlidersHorizontal, Users, XCircle } from "lucide-react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateRangePicker from "./DateRangePicker";
import { useTranslation } from 'react-i18next';
import QuantityInput from "./QuantityInput";
import { useEffect, useRef, useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";
import { Location } from "../types/Location";
import { searchHotels } from "../services/hotelService";
import { HotelWithRating } from "../types/hotelSearched";

interface SearchBarProps {
  onSearchResults: (
    results: HotelWithRating[],
    params: { checkInDate: string; checkOutDate: string; maxGuests: number, serviceIds: number[]; }
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
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:8082/api/service/v1');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: { id: number; name: string }[] = await res.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services', err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleSearch = async () => {
    setLoading(true);
    const request = {
      name: searchText,
      checkIn: dateRange[0].startDate.toISOString().split("T")[0],
      checkOut: dateRange[0].endDate.toISOString().split("T")[0],
      maxGuests: numPeople,
      serviceIds: selectedServiceIds,
    };

    try {
      const results = await searchHotels(request);
      onSearchResults(results, {
        checkInDate: request.checkIn,
        checkOutDate: request.checkOut,
        maxGuests: request.maxGuests,
        serviceIds: selectedServiceIds
      });
    } catch (error) {
      console.error("Error buscando hoteles:", error);
      onSearchResults([], {
        checkInDate: request.checkIn,
        checkOutDate: request.checkOut,
        maxGuests: request.maxGuests,
        serviceIds: selectedServiceIds
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchText('');
    setSelectedLocation(null);
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setNumPeople(1);
    setSelectedServiceIds([]);
  };

  const toggleService = (serviceId: number) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
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

        {/* Botón Filtros */}
        <div className="relative w-full md:w-auto" ref={serviceDropdownRef}>
          <button
            type="button"
            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
          >
            <SlidersHorizontal size={16} />
            Filtros
          </button>

          {showServiceDropdown && (
            <div className="absolute z-50 mt-2 w-full md:w-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto p-2">
              {services.map(service => (
                <label
                  key={service.id}
                  className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer w-full block"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2 flex-shrink-0"
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                  />
                  <span className="truncate">{service.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Personas */}
        <div className="w-full md:w-auto">
          <QuantityInput
            icon={<Users />}
            min={1}
            max={5}
            defaultValue={1}
            value={numPeople}
            onChange={(numPeople) => setNumPeople(numPeople)}
            tooltipKey="peopleCount"
          />
        </div>

        {/* Botones Acciones */}
        <div className="flex gap-2 w-full md:w-auto">
          {/* Botón Limpiar */}
          <button
            onClick={handleClear}
            title={t('clean')}
            className="flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-600 w-full md:w-auto h-[42px]"
          >
            <Eraser size={18} />
          </button>

          {/* Botón Buscar */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`bg-[#0d6efd] text-white px-6 py-2 rounded-lg transition w-full md:w-auto h-[42px]
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
