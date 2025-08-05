import { useState, useMemo } from 'react'; // Corregido: 'React' no es necesario
import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WidgetConfig } from '../../../types';

// A. El Componente de React con toda la lógica
export const CalendarWidget: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    // Días del mes anterior para rellenar
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isPlaceholder: true });
    }
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const today = new Date();
      const isToday = i === today.getDate() &&
                      currentDate.getMonth() === today.getMonth() &&
                      currentDate.getFullYear() === today.getFullYear();
      days.push({ day: i, isToday });
    }
    return days;
  }, [currentDate, daysInMonth, startingDayOfWeek]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col h-full text-text-dark p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-accent/50">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-accent/50">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-sm mb-2">
        <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
      </div>
      <div className="grid grid-cols-7 text-center gap-1">
        {calendarDays.map((d, index) => (
          <div key={index} className={`w-9 h-9 flex items-center justify-center rounded-full ${d.isPlaceholder ? '' : 'hover:bg-accent/50'} ${d.isToday ? 'bg-widget-header text-text-light' : ''}`}>
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
};

// B. El objeto de configuración que permite la detección automática
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'calendar',
  title: 'Calendario',
  icon: <img src="/escritorio/icons/Calendar.png" alt="Calendario" width="52" height="52" />,
  defaultSize: { width: 320, height: 350 },
};
