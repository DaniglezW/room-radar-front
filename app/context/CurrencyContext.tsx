'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

interface CurrencyContextType {
  currency: string;
  rate: number;
  changeCurrency: (newCurrency: string) => void;
  supportedCurrencies: string[];
  formatPrice: (valueInEUR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SUPPORTED_CURRENCIES = [
  'EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'BRL', 'MXN'
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  BRL: 'R$',
  MXN: 'MX$',
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState('EUR');
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    };
    fetchRates();
  }, []);

  const changeCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (newCurrency === 'EUR') {
      setRate(1);
    } else if (rates[newCurrency]) {
      setRate(rates[newCurrency]);
    }
  };

  const formatPrice = (valueInEUR: number) => {
    const converted = valueInEUR * rate;
    const symbol = CURRENCY_SYMBOLS[currency] || '';
    return `${converted.toFixed(2)} ${symbol}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        rate,
        changeCurrency,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};