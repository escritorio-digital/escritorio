// js/widgets/dice.js

/**
 * Widget de Lanzar Dados
 * Lanza un número configurable de dados de seis caras.
 */
export const dice = {
    html: `
        <div class="text-center">
            <div class="flex justify-center items-center gap-4 mb-4">
                <label class="font-medium">Dados:</label>
                <input type="number" min="1" max="10" value="2" class="dice-count w-20 p-1 text-center">
            </div>
            <button class="dice-roll w-full btn-secondary text-xl">¡Lanzar!</button>
            <div class="dice-results mt-4 flex flex-wrap justify-center gap-4"></div>
        </div>`,
    initializer: (widget) => {
        const countInput = widget.querySelector('.dice-count');
        const rollBtn = widget.querySelector('.dice-roll');
        const resultsDiv = widget.querySelector('.dice-results');

        rollBtn.addEventListener('click', () => {
            const count = parseInt(countInput.value, 10) || 1;
            resultsDiv.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const value = Math.floor(Math.random() * 6) + 1;
                const face = document.createElement('div');
                face.style.cssText = 'display:grid; grid-template-columns: repeat(3, 1fr); gap: 2px; flex:0 0 70px; padding:8px; background-color:#F4F8D3; width:70px; height:70px; border-radius:10px;';
                
                // Patrones de puntos para cada cara del dado
                const pipPositions = {
                    1: ['5'], 2: ['1', '9'], 3: ['1', '5', '9'], 4: ['1', '3', '7', '9'], 5: ['1', '3', '5', '7', '9'], 6: ['1', '3', '4', '6', '7', '9']
                };

                for (let j = 1; j <= 9; j++) {
                    const pip = document.createElement('span');
                    if (pipPositions[value].includes(String(j))) {
                        pip.style.cssText = 'width:15px; height:15px; border-radius:50%; background:var(--color-text-dark); margin: auto;';
                    }
                    face.appendChild(pip);
                }
                resultsDiv.appendChild(face);
            }
        });
    }
};
