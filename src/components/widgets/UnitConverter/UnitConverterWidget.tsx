import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import { ArrowRightLeft } from 'lucide-react';
import './UnitConverter.css';

// --- Base de Datos de Conversiones ---
// Definimos tipos más explícitos para ayudar a TypeScript
type UnitMap = { [unit: string]: (value: number) => number };

const CONVERSIONS = {
  Longitud: {
    baseUnit: 'Metros',
    units: {
      'Metros': (v: number) => v,
      'Kilómetros': (v: number) => v / 1000,
      'Millas': (v: number) => v / 1609.34,
      'Pies': (v: number) => v * 3.28084,
    } as UnitMap,
  },
  Peso: {
    baseUnit: 'Kilogramos',
    units: {
      'Kilogramos': (v: number) => v,
      'Gramos': (v: number) => v * 1000,
      'Libras': (v: number) => v * 2.20462,
      'Onzas': (v: number) => v * 35.274,
    } as UnitMap,
  },
  Temperatura: {
    baseUnit: 'Celsius',
    units: {
      'Celsius': (v: number) => v,
      'Fahrenheit': (v: number) => (v * 9/5) + 32,
      'Kelvin': (v: number) => v + 273.15,
    } as UnitMap,
  }
};

type Category = keyof typeof CONVERSIONS;

// El componente principal del Conversor
export const UnitConverterWidget: FC = () => {
  const [category, setCategory] = useState<Category>('Longitud');
  const [fromUnit, setFromUnit] = useState<string>('Metros');
  const [toUnit, setToUnit] = useState<string>('Pies');
  const [fromValue, setFromValue] = useState<string | number>(1);
  const [toValue, setToValue] = useState<string | number>('');
  const [isTyping, setIsTyping] = useState<'from' | 'to'>('from');

  const availableUnits = Object.keys(CONVERSIONS[category].units);

  // Efecto para recalcular cuando cambian las dependencias
  useEffect(() => {
    const fromVal = parseFloat(String(fromValue));
    const toVal = parseFloat(String(toValue));
    const categoryData = CONVERSIONS[category];
    const units = categoryData.units;

    if (isTyping === 'from') {
      if (isNaN(fromVal)) {
        setToValue('');
        return;
      }
      let baseValue: number;
      if (category === 'Temperatura') {
        if (fromUnit === 'Fahrenheit') baseValue = (fromVal - 32) * 5/9;
        else if (fromUnit === 'Kelvin') baseValue = fromVal - 273.15;
        else baseValue = fromVal;
      } else {
        const toBaseConverter = Object.entries(units).find(([key, _]) => key === fromUnit)![1];
        baseValue = fromVal / toBaseConverter(1);
      }
      const finalValue = units[toUnit](baseValue);
      setToValue(parseFloat(finalValue.toFixed(4)));

    } else if (isTyping === 'to') {
        if (isNaN(toVal)) {
            setFromValue('');
            return;
        }
        let baseValue: number;
        if (category === 'Temperatura') {
            if (toUnit === 'Fahrenheit') baseValue = (toVal - 32) * 5/9;
            else if (toUnit === 'Kelvin') baseValue = toVal - 273.15;
            else baseValue = toVal;
        } else {
            const toBaseConverter = Object.entries(units).find(([key, _]) => key === toUnit)![1];
            baseValue = toVal / toBaseConverter(1);
        }
        const finalValue = units[fromUnit](baseValue);
        setFromValue(parseFloat(finalValue.toFixed(4)));
    }
  }, [fromValue, toValue, fromUnit, toUnit, category, isTyping]);
  
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    setIsTyping('from');
  };
  
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    setIsTyping('to');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setCategory(newCategory);
    const newUnits = Object.keys(CONVERSIONS[newCategory].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
    setFromValue(1);
    setIsTyping('from');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setIsTyping('from');
  };

  return (
    <div className="unit-converter-widget">
      <div className="category-selector">
        <label htmlFor="category">Categoría:</label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          {Object.keys(CONVERSIONS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="conversion-interface">
        <div className="unit-group">
          <input type="number" value={fromValue} onChange={handleFromChange} />
          <select value={fromUnit} onChange={e => { setFromUnit(e.target.value); setIsTyping('from'); }}>
            {availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>

        <button onClick={swapUnits} className="swap-button" title="Intercambiar unidades">
          <ArrowRightLeft size={20} />
        </button>

        <div className="unit-group">
          <input type="number" value={toValue} onChange={handleToChange} />
          <select value={toUnit} onChange={e => { setToUnit(e.target.value); setIsTyping('to'); }}>
            {availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};


export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'unit-converter',
  title: 'Conversor de Unidades',
  icon: <img src="/escritorio/icons/UnitConverter.png" alt="Conversor de Unidades" width="52" height="52" />,
  defaultSize: { width: 450, height: 200 },
};