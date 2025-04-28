"use client";
import { Search, Users } from "lucide-react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateRangePicker from "./DateRangePicker";
import { useTranslation } from 'react-i18next';

export default function SearchBar() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-md relative">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('search')}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      <DateRangePicker />

      <div className="relative flex items-center border border-gray-300 px-4 py-2 rounded-lg">
        <Users className="mr-2 text-gray-400" />
        <button className="text-lg px-2">-</button>
        <span className="mx-2">1</span>
        <button className="text-lg px-2">+</button>
      </div>
    </div>
  );
}
