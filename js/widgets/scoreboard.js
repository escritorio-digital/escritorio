// js/widgets/scoreboard.js

/**
 * Widget de Marcador
 * Un marcador simple para varios jugadores o equipos.
 */
export const scoreboard = {
    html: `
        <div class="flex flex-col h-full">
            <div class="scoreboard-setup">
                <h3 class="text-lg font-semibold">Jugadores/Equipos</h3>
                <textarea class="scoreboard-names w-full p-2 mb-2" rows="4" placeholder="Un nombre por línea"></textarea>
                <button class="scoreboard-start btn-primary w-full">Empezar</button>
            </div>
            <div class="scoreboard-main hidden"></div>
        </div>`,
    initializer: (widget) => {
        const setupDiv = widget.querySelector('.scoreboard-setup');
        const mainDiv = widget.querySelector('.scoreboard-main');
        const namesArea = widget.querySelector('.scoreboard-names');
        const startBtn = widget.querySelector('.scoreboard-start');

        startBtn.addEventListener('click', () => {
            const names = namesArea.value.split('\n').filter(n => n.trim() !== '');
            if (names.length === 0) return;

            setupDiv.classList.add('hidden');
            mainDiv.classList.remove('hidden');
            mainDiv.innerHTML = '';

            names.forEach(name => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'scoreboard-player';
                playerDiv.innerHTML = `
                    <span class="name font-semibold">${name}</span>
                    <div class="controls flex items-center gap-2">
                        <button class="btn-minus btn-tertiary">-</button>
                        <span class="score">0</span>
                        <button class="btn-plus btn-secondary">+</button>
                    </div>`;
                mainDiv.appendChild(playerDiv);

                const scoreSpan = playerDiv.querySelector('.score');
                playerDiv.querySelector('.btn-plus').addEventListener('click', () => {
                    scoreSpan.textContent = parseInt(scoreSpan.textContent, 10) + 1;
                });
                playerDiv.querySelector('.btn-minus').addEventListener('click', () => {
                    scoreSpan.textContent = parseInt(scoreSpan.textContent, 10) - 1;
                });
            });
        });
    }
};
