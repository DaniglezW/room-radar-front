'use client';

import { useCurrency } from '@/context/CurrencyContext';

const CurrencySwitcher = () => {
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => changeCurrency(e.target.value)}
      className="border px-2 py-1 rounded-md"
      title="Select Currency"
    >
      {supportedCurrencies.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  );
};

export default CurrencySwitcher;