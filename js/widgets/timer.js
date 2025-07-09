// js/widgets/timer.js

/**
 * Widget de Temporizador
 * Un temporizador de cuenta regresiva simple con controles de inicio, pausa y reinicio.
 */
export const timer = {
    html: `
        <div class="text-center">
            <div class="timer-display text-6xl font-mono font-bold mb-4">00:05:00</div>
            <div class="flex flex-wrap justify-center items-center gap-2 mb-4">
                <input type="number" min="0" max="59" value="5" class="timer-minutes w-16 p-1 text-center">
                <span class="font-semibold">m</span>
                <input type="number" min="0" max="59" value="0" class="timer-seconds w-16 p-1 text-center">
                <span class="font-semibold">s</span>
            </div>
            <div class="flex justify-center gap-2">
                <button class="timer-start btn-primary">Iniciar</button>
                <button class="timer-pause btn-secondary">Pausar</button>
                <button class="timer-reset btn-tertiary">Reiniciar</button>
            </div>
        </div>`,
    initializer: (widget) => {
        const display = widget.querySelector('.timer-display');
        const minutesInput = widget.querySelector('.timer-minutes');
        const secondsInput = widget.querySelector('.timer-seconds');
        let timerInterval = null;
        let totalSeconds = 0;

        const setInitialTime = () => {
            totalSeconds = (parseInt(minutesInput.value, 10) || 0) * 60 + (parseInt(secondsInput.value, 10) || 0);
            updateDisplay();
        };

        const updateDisplay = () => {
            const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const sec = String(totalSeconds % 60).padStart(2, '0');
            display.textContent = `${min}:${sec}`;
            display.style.color = totalSeconds <= 10 && totalSeconds > 0 ? '#d9534f' : 'var(--color-text-dark)';
        };

        widget.querySelector('.timer-start').addEventListener('click', () => {
            if (timerInterval) return;
            clearInterval(timerInterval);
            setInitialTime();
            if (totalSeconds <= 0) return;

            timerInterval = setInterval(() => {
                totalSeconds--;
                updateDisplay();
                if (totalSeconds <= 0) {
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

        widget.querySelector('.timer-reset').addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            setInitialTime();
        });

        minutesInput.addEventListener('change', setInitialTime);
        secondsInput.addEventListener('change', setInitialTime);

        // Función de limpieza para detener el intervalo si el widget se cierra
        widget.cleanup = () => clearInterval(timerInterval);

        setInitialTime();
    }
};
