'use client';

import { useCurrency } from '@/context/CurrencyContext';

const CurrencySwitcher = () => {
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();

  return (
    <div className="relative inline-block">
      <select
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
        className="appearance-none bg-transparent text-white px-4 py-2 pr-8 rounded-xl border border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition duration-150 ease-in-out cursor-pointer"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
      >
        {supportedCurrencies.map((cur) => (
          <option
            key={cur}
            value={cur}
            className="bg-blue-900 text-white"
          >
            {cur}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white group-hover:text-white/60 transition">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CurrencySwitcher;