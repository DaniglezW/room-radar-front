'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface QuantityInputProps {
  icon?: React.ReactNode;
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  tooltip?: string;
  tooltipKey?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  icon,
  min = 0,
  max = 10,
  defaultValue = 0,
  onChange,
  tooltip,
  tooltipKey,
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const { t } = useTranslation();

  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const resolvedTooltip = tooltipKey ? t(tooltipKey) : tooltip;

  return (
    <div
      className="relative flex items-center border border-gray-300 px-4 py-2 rounded-lg bg-white text-black"
      title={resolvedTooltip}
    >
      {icon && <div className="mr-2 text-gray-400">{icon}</div>}
      <button
        onClick={handleDecrease}
        className="text-lg px-2 text-gray-500 hover:text-black disabled:opacity-30"
        disabled={value === min}
      >
        –
      </button>
      <span className="mx-2 min-w-[20px] text-center">{value}</span>
      <button
        onClick={handleIncrease}
        className="text-lg px-2 text-gray-500 hover:text-black disabled:opacity-30"
        disabled={value === max}
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;