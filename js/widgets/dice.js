// js/widgets/dice.js

import { playSound } from '../utils.js';

/**
 * Widget de Lanzar Dados
 * Lanza un número configurable de dados con animación CSS.
 */
export const dice = {
    html: `
        <div class="text-center">
            <div class="flex justify-center items-center gap-4 mb-4">
                <label class="font-medium">Dados:</label>
                <input type="number" min="1" max="10" value="1" class="dice-count w-20 p-1 text-center">
            </div>
            <button class="dice-roll w-full btn-secondary text-xl mb-4">¡Lanzar!</button>
            <div class="dice-results flex flex-wrap justify-center gap-4"></div>
        </div>`,
    initializer: (widget) => {
        const countInput = widget.querySelector('.dice-count');
        const rollBtn = widget.querySelector('.dice-roll');
        const resultsDiv = widget.querySelector('.dice-results');

        const createDiceFace = (value) => {
            const face = document.createElement('div');
            face.className = 'dice-face';
            const pipPositions = {
                1: ['5'], 2: ['1', '9'], 3: ['1', '5', '9'], 4: ['1', '3', '7', '9'], 5: ['1', '3', '5', '7', '9'], 6: ['1', '3', '4', '6', '7', '9']
            };
            for (let i = 1; i <= 9; i++) {
                const pip = document.createElement('span');
                if (pipPositions[value].includes(String(i))) {
                    pip.className = 'pip';
                }
                face.appendChild(pip);
            }
            return face;
        };

        rollBtn.addEventListener('click', () => {
            const count = parseInt(countInput.value, 10) || 1;
            resultsDiv.innerHTML = '';

            // --- LÍNEA DESACTIVADA ---
            // Al comentar la siguiente línea, el navegador ya no intentará cargar el archivo de sonido.
            /*
            playSound('dice-roll.wav').catch(error => {
                console.warn("No se pudo reproducir el sonido (el archivo no existe):", error);
            });
            */

            for (let i = 0; i < count; i++) {
                const tempFace = document.createElement('div');
                tempFace.className = 'dice-face is-rolling';
                resultsDiv.appendChild(tempFace);

                setTimeout(() => {
                    const finalValue = Math.floor(Math.random() * 6) + 1;
                    const finalFace = createDiceFace(finalValue);
                    
                    if(resultsDiv.contains(tempFace)) {
                        resultsDiv.replaceChild(finalFace, tempFace);
                    }
                }, 1000);
            }
        });
    }
};