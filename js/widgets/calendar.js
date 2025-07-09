// js/widgets/calendar.js

/**
 * Widget de Calendario
 * Muestra un calendario mensual interactivo.
 */
export const calendar = {
    html: `
        <div class="flex flex-col h-full">
            <div class="calendar-header flex justify-between items-center mb-4">
                <button class="prev-month-btn btn-secondary">&lt;</button>
                <h3 class="calendar-title text-xl font-bold"></h3>
                <button class="next-month-btn btn-secondary">&gt;</button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center">
                <div class="calendar-day-name">L</div><div class="calendar-day-name">M</div><div class="calendar-day-name">X</div><div class="calendar-day-name">J</div><div class="calendar-day-name">V</div><div class="calendar-day-name">S</div><div class="calendar-day-name">D</div>
            </div>
            <div class="calendar-body grid grid-cols-7 gap-1 text-center mt-2"></div>
        </div>`,
    initializer: (widget) => {
        const headerTitle = widget.querySelector('.calendar-title');
        const calendarBody = widget.querySelector('.calendar-body');
        const prevBtn = widget.querySelector('.prev-month-btn');
        const nextBtn = widget.querySelector('.next-month-btn');
        let date = new Date();

        const renderCalendar = () => {
            date.setDate(1);
            calendarBody.innerHTML = '';
            const monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
            const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
            const firstDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
            const nextDays = 7 - (lastDayIndex === 0 ? 7 : lastDayIndex);
            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            
            headerTitle.textContent = `${months[date.getMonth()]} ${date.getFullYear()}`;
            
            for (let x = firstDayIndex; x > 0; x--) { calendarBody.innerHTML += `<div class="calendar-day other-month">${prevLastDay - x + 1}</div>`; }
            
            for (let i = 1; i <= monthDays; i++) {
                const today = new Date();
                if (i === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
                    calendarBody.innerHTML += `<div class="calendar-day current-day">${i}</div>`;
                } else {
                    calendarBody.innerHTML += `<div class="calendar-day">${i}</div>`;
                }
            }
            
            for (let j = 1; j <= nextDays; j++) { calendarBody.innerHTML += `<div class="calendar-day other-month">${j}</div>`; }
        };

        prevBtn.addEventListener('click', () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
        nextBtn.addEventListener('click', () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });

        renderCalendar();
    }
};
