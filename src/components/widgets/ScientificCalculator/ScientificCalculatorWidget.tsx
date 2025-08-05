import { useState } from 'react';
import type { FC } from 'react';
import type { WidgetConfig } from '../../../types';
import './ScientificCalculatorWidget.css';

// Mapeo de botones para facilitar la creación del layout
const buttons = [
  'rad', 'deg', 'x!', '(', ')', '%', 'AC',
  'sin', 'ln', '7', '8', '9', '÷',
  'cos', 'log', '4', '5', '6', '×',
  'tan', '√', '1', '2', '3', '-',
  'e', 'π', '0', '.', '=', '+',
];

export const ScientificCalculatorWidget: FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRadians, setIsRadians] = useState(true);

  // Función para evaluar de forma segura la expresión matemática
  const evaluateExpression = (expr: string): string => {
    try {
      let evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100') // Manejo de porcentaje
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Reemplazo de funciones (incluyendo la raíz cuadrada)
      // 👇 LÍNEA AÑADIDA Y MEJORADA
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
      const finalExpression = expression || display;
      const result = evaluateExpression(finalExpression);
      setDisplay(result);
      setExpression(result);
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
    if (display === 'Error' || (expression.includes('=') && !['+', '-', '×', '÷', '%'].includes(btn))) {
      setDisplay(btn);
      setExpression(btn);
      return;
    }

    if (display === '0' && btn !== '.') {
      setDisplay(btn);
    } else {
      setDisplay(prev => prev + btn);
    }
    setExpression(prev => prev + btn);
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


  return (
    <div className="scientific-calculator">
      <div className="display-area">
        <div className="expression">{expression.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
        <div className="main-display">{display}</div>
      </div>
      <div className="buttons-grid">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`calc-button ${
              ['=', '+', '-', '×', '÷'].includes(btn) ? 'operator' : ''
            } ${btn === 'AC' ? 'ac' : ''} ${
                (btn === 'rad' && isRadians) || (btn === 'deg' && !isRadians) ? 'mode-active' : ''
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'scientific-calculator',
  title: 'Calculadora Científica',
  icon: <img src="/escritorio/icons/ScientificCalculator.png" alt="Calculadora Científica" width="52" height="52" />,
  defaultSize: { width: 400, height: 550 },
};