'use client';
import { Building2, Earth, Hotel, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Location } from "../types/Location";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSelect: (item: Location) => void;
  hasError?: boolean;
}

export default function LocationAutocomplete({ value, onChange, onSelect, hasError }: Props) {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.length >= 2) {
        fetch(`http://localhost:8082/api/hotel/v1/search?query=${value}`)
          .then(res => res.json())
          .then(data => {
            setResults(data);
            setShowDropdown(true);
          })
          .catch(() => {
            setResults([]);
            setShowDropdown(false);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'city': return <Building2 className="w-4 h-4 text-gray-500 mr-2" />;
      case 'country': return <Earth className="w-4 h-4 text-gray-500 mr-2" />;
      case 'hotel': return <Hotel className="w-4 h-4 text-gray-500 mr-2" />;
      default: return null;
    }
  };

  const handleSelect = (item: Location) => {
    onSelect(item);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input con iconos a izquierda y derecha */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 2 && results.length > 0 && setShowDropdown(true)}
          placeholder={t('placeSearch')}
          className={`pl-10 pr-10 py-2 border rounded-lg w-full 
            ${hasError ? 'border-red-500' : 'border-gray-300'}`}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {hasError && (
          <p className="absolute left-0 top-full mt-1 text-red-500 text-sm z-20 bg-white px-2 rounded">
            Introduce un destino para empezar a buscar
          </p>
        )}

      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {getIcon(item.type)}
              <span><b>{item.name}</b></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
