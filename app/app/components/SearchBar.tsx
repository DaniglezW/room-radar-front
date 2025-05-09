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

export default function SearchBar() {
  const { t } = useTranslation();

  const [numPeople, setNumPeople] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [locationError, setLocationError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSearch = () => {
    if (!selectedLocation) {
      setLocationError(true);
      return;
    }
  
    setLocationError(false);
    console.log("Buscando:", selectedLocation?.type + ": " + searchText + ",\nNum People: " + numPeople + ",\nCheck-in: " + dateRange[0].startDate + ",\nCheck-out: " + dateRange[0].endDate);
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
              setLocationError(false);
            }}
            onSelect={(item) => {
              setSelectedLocation(item);
              setSearchText(item.name);
              setLocationError(false);
            }}
            hasError={locationError}
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
            className="bg-[#0d6efd] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full md:w-auto"
          >
            Buscar
          </button>
        </div>
      </div>

    </div>
  );
}
