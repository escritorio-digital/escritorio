// js/widgets/timer.js

/**
 * Widget de Temporizador
 * Un temporizador de cuenta regresiva con una barra de progreso circular y controles externos mejorados.
 */
export const timer = {
    html: `
        <div class="timer-wrapper">
            <div class="timer-container">
                <svg class="timer-svg" viewBox="0 0 100 100">
                    <circle class="timer-circle-bg" r="45" cx="50" cy="50"></circle>
                    <circle class="timer-circle-progress" r="45" cx="50" cy="50"></circle>
                </svg>
                <div class="timer-display">00:00</div>
            </div>

            <div class="timer-inputs">
                <input type="number" min="0" max="59" value="5" class="timer-minutes" aria-label="Minutos">
                <span class="font-bold text-2xl">:</span>
                <input type="number" min="0" max="59" value="0" class="timer-seconds" aria-label="Segundos">
            </div>

            <div class="timer-controls">
                <button class="timer-start" title="Iniciar">▶️</button>
                <button class="timer-pause" title="Pausar">⏸️</button>
                <button class="timer-reset" title="Reiniciar">🔄</button>
            </div>
        </div>
    `,
    initializer: (widget) => {
        const display = widget.querySelector('.timer-display');
        const minutesInput = widget.querySelector('.timer-minutes');
        const secondsInput = widget.querySelector('.timer-seconds');
        const progressCircle = widget.querySelector('.timer-circle-progress');
        
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        let timerInterval = null;
        let totalDuration = 0;
        let remainingSeconds = 0;

        // --- NUEVA FUNCIÓN PARA FORMATEAR LOS INPUTS ---
        const formatInputValue = (inputElement) => {
            let value = parseInt(inputElement.value, 10) || 0;
            if (value < 0) value = 0;
            if (value > 59) value = 59;
            inputElement.value = String(value).padStart(2, '0');
        };

        const updateDisplay = () => {
            const min = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
            const sec = String(remainingSeconds % 60).padStart(2, '0');
            display.textContent = `${min}:${sec}`;
        };

        const setProgress = (percent) => {
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressCircle.classList.toggle('ending', percent <= 20 && percent > 0);
        };

        const setInitialTime = () => {
            clearInterval(timerInterval);
            timerInterval = null;
            // Aseguramos que los valores estén formateados antes de calcular
            formatInputValue(minutesInput);
            formatInputValue(secondsInput);
            totalDuration = (parseInt(minutesInput.value, 10)) * 60 + (parseInt(secondsInput.value, 10));
            remainingSeconds = totalDuration;
            updateDisplay();
            setProgress(100);
        };
        
        // --- EVENTOS ACTUALIZADOS ---
        minutesInput.addEventListener('change', setInitialTime);
        secondsInput.addEventListener('change', setInitialTime);
        // Formatea el valor al dejar el campo para una mejor experiencia
        minutesInput.addEventListener('blur', () => formatInputValue(minutesInput));
        secondsInput.addEventListener('blur', () => formatInputValue(secondsInput));

        widget.querySelector('.timer-start').addEventListener('click', () => {
            if (timerInterval || remainingSeconds <= 0) return;
            if (remainingSeconds === 0 && totalDuration > 0) {
                 setInitialTime();
            }
            timerInterval = setInterval(() => {
                remainingSeconds--;
                updateDisplay();
                const percent = (remainingSeconds / totalDuration) * 100;
                setProgress(percent);
                if (remainingSeconds <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    display.textContent = "¡FIN!";
                    if (window.Tone) new Tone.Synth().toDestination().triggerAttackRelease("C5", "0.5s");
                }
            }, 1000);
        });

        widget.querySelector('.timer-pause').addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
        });

        widget.querySelector('.timer-reset').addEventListener('click', setInitialTime);

        widget.cleanup = () => clearInterval(timerInterval);
        
        // Formatea los valores iniciales al cargar el widget
        setInitialTime();
    }
};