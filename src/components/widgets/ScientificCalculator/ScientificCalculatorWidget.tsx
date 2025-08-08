import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import './ScientificCalculatorWidget.css';

// --- LAYOUTS DE BOTONES PARA CADA MODO ---

const scientificLayout = [
  'rad', 'deg', 'x!', '(', ')',
  'sin', 'cos', 'tan', 'ln', 'log',
  '7',   '8',   '9',   '÷', 'AC',
  '4',   '5',   '6',   '×', '%',
  '1',   '2',   '3',   '-', '√',
  '0',   '.',   'e',   'π', '+',
  '='
];

const standardLayout = [
  '(', ')', '%', 'AC',
  '7', '8', '9', '÷',
  '4', '5', '6', '×',
  '1', '2', '3', '-',
  '0', '.', '√', '+',
  '='
];

const basicLayout = [
  '7', '8', '9', '÷',
  '4', '5', '6', '×',
  '1', '2', '3', '-',
  '0', '.', 'AC', '+',
  '='
];

// --- GRUPOS DE BOTONES PARA ESTILO ---
const operators = ['=', '+', '-', '×', '÷'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
// El resto serán considerados 'function' por defecto en la lógica de clases


export const ScientificCalculatorWidget: FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRadians, setIsRadians] = useState(true);
  const [mode, setMode] = useState('Scientific'); // 'Scientific', 'Standard' o 'Basic'

  const evaluateExpression = (expr: string): string => {
    try {
      let evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');
        
      evalExpr = evalExpr.replace(/√\(([^)]+)\)/g, (_, value) => `Math.sqrt(${evaluateExpression(value)})`);
      evalExpr = evalExpr.replace(/log\(([^)]+)\)/g, (_, value) => `Math.log10(${evaluateExpression(value)})`);
      evalExpr = evalExpr.replace(/ln\(([^)]+)\)/g, (_, value) => `Math.log(${evaluateExpression(value)})`);
      
      evalExpr = evalExpr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, func, value) => {
        const number = evaluateExpression(value);
        if (isRadians) {
          return `Math.${func}(${number})`;
        } else {
          return `Math.${func}(${number} * Math.PI / 180)`;
        }
      });
      
      evalExpr = evalExpr.replace(/(\d+)!/g, (_, num) => {
        let n = parseInt(num);
        if (n > 20) return 'Infinity';
        if (n === 0) return '1';
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result.toString();
      });

      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + evalExpr)();
      
      if (Math.abs(result) > 1e15) return result.toExponential(9);
      return String(parseFloat(result.toFixed(10)));
      
    } catch (error) {
      return 'Error';
    }
  };


  const handleButtonClick = (btn: string) => {
    if (btn === 'AC') {
      setDisplay('0');
      setExpression('');
    } else if (btn === '=') {
      // --- INICIO DE LA CORRECCIÓN ---
      const finalExpression = expression || display;
      const result = evaluateExpression(finalExpression);
      
      setDisplay(result); // La pantalla principal muestra el resultado
      setExpression(finalExpression + '='); // La expresión de arriba muestra la operación completa
      // --- FIN DE LA CORRECCIÓN ---
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(btn)) {
        handleFunction(btn);
    } else if (btn === 'rad' || btn === 'deg') {
        setIsRadians(btn === 'rad');
    } else if (btn === 'x!') {
        setExpression(prev => prev + '!');
        setDisplay(prev => prev + '!');
    } else {
      handleInput(btn);
    }
  };
  
  const handleInput = (btn: string) => {
    if (display === 'Error' || (expression.includes('=') && !operators.includes(btn))) {
      setDisplay(btn);
      setExpression(btn);
      return;
    }

    if (display === '0' && btn !== '.') {
      setDisplay(btn);
    } else {
      setDisplay(prev => prev + btn);
    }
    
    // Si la última operación fue un igual, la nueva expresión empieza de cero con el nuevo botón
    if (expression.includes('=')) {
        setExpression(btn);
    } else {
        setExpression(prev => prev + btn);
    }
  }

  const handleFunction = (func: string) => {
    const newExpression = func + '(';
    if (display === 'Error' || expression.includes('=') || display === '0') {
      setDisplay(newExpression);
      setExpression(newExpression);
    } else {
      setDisplay(prev => prev + newExpression);
      setExpression(prev => prev + newExpression);
    }
  }
  
  // --- LÓGICA PARA DETERMINAR EL LAYOUT Y LA CUADRÍCULA ---
  const currentLayout = mode === 'Basic' ? basicLayout : 
                        mode === 'Standard' ? standardLayout : 
                        scientificLayout;
                        
  const gridClass = mode === 'Scientific' ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <div className="scientific-calculator">
      <div className="mode-selector">
        <button className={`mode-button ${mode === 'Basic' ? 'mode-active' : ''}`} onClick={() => setMode('Basic')}>Básica</button>
        <button className={`mode-button ${mode === 'Standard' ? 'mode-active' : ''}`} onClick={() => setMode('Standard')}>Estándar</button>
        <button className={`mode-button ${mode === 'Scientific' ? 'mode-active' : ''}`} onClick={() => setMode('Scientific')}>Científica</button>
      </div>
      <div className="display-area">
        <div className="expression">{expression.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
        <div className="main-display">{display}</div>
      </div>
      <div className={`buttons-grid ${gridClass}`}>
        {currentLayout.map((btn) => {
          const isOperator = operators.includes(btn);
          const isNumber = numbers.includes(btn);
          const isAC = btn === 'AC';
          
          let buttonClass = 'function'; // Clase por defecto
          if (isOperator) buttonClass = 'operator';
          if (isNumber) buttonClass = 'number';
          
          let spanClass = '';
          if (btn === '0' && mode === 'Scientific') spanClass = 'col-span-2';
          if (btn === '=') spanClass = mode === 'Scientific' ? 'col-span-5' : 'col-span-4';

          return (
            <button
              key={`${mode}-${btn}`} // La key debe ser única para cada botón en cada modo
              onClick={() => handleButtonClick(btn)}
              className={`calc-button ${buttonClass} 
                ${isAC ? 'ac' : ''}
                ${(btn === 'rad' && isRadians) || (btn === 'deg' && !isRadians) ? 'mode-active' : ''}
                ${spanClass}
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'scientific-calculator',
  title: 'Calculadora', // Título genérico
  icon: <img src="/icons/ScientificCalculator.png" alt="Calculadora" width="52" height="52" />,
  defaultSize: { width: 400, height: 550 },
};
