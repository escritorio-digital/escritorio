// js/widgets/student-picker.js

/**
 * Widget de Selector Aleatorio (Ruleta)
 * Elige un nombre con una ruleta que se expande al girar.
 */
export const studentPicker = {
    html: `
        <div class="sp-container flex flex-col h-full items-center">
            <h3 class="text-lg font-semibold mb-1 w-full">Participantes</h3>
            <textarea class="sp-names w-full h-20 p-2 mb-2" placeholder="Un nombre por línea..."></textarea>
            
            <div class="sp-wheel-wrapper">
                <canvas id="sp-canvas" width="250" height="250"></canvas>
                <div class="sp-pointer"></div>
            </div>

            <div class="sp-result-display text-2xl font-bold min-h-[2.5rem] p-2"></div>
            
            <div class="w-full mt-auto flex gap-2">
                 <button class="sp-spin-btn w-full btn-primary text-lg">¡Girar!</button>
                 <button class="sp-reset-btn btn-tertiary">Reiniciar</button>
            </div>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.sp-names');
        const spinBtn = widget.querySelector('.sp-spin-btn');
        const resetBtn = widget.querySelector('.sp-reset-btn');
        const resultDisplay = widget.querySelector('.sp-result-display');
        
        const canvas = widget.querySelector('#sp-canvas');
        const ctx = canvas.getContext('2d');

        let participants = [];
        let availableParticipants = [];
        const colors = ["#F7CFD8", "#8E7DBE", "#A6D6D6", "#F4F8D3", "#d9534f", "#a8c030"];
        let currentAngle = 0;
        let isSpinning = false;

        const drawWheel = (context, size, wheelParticipants, angle) => {
            const numSegments = wheelParticipants.length;
            const center = size / 2;
            const radius = center * 0.95;
            
            context.clearRect(0, 0, size, size);
            if (numSegments === 0) return;
            
            context.save();
            context.translate(center, center);
            context.rotate(angle);
            
            const segmentAngle = (2 * Math.PI) / numSegments;
            
            for (let i = 0; i < numSegments; i++) {
                context.beginPath();
                context.fillStyle = colors[i % colors.length];
                context.moveTo(0, 0);
                context.arc(0, 0, radius, i * segmentAngle, (i + 1) * segmentAngle);
                context.closePath();
                context.fill();
                
                context.save();
                context.fillStyle = "#493e6a";
                context.font = `bold ${Math.max(12, Math.floor(size / 25))}px Inter`;
                context.textAlign = "center";
                context.textBaseline = "middle";
                const textAngle = (i * segmentAngle) + (segmentAngle / 2);
                context.rotate(textAngle);
                ctx.fillText(wheelParticipants[i], radius * 0.65, 0);
                context.restore();
            }
            context.restore();
        };

        const updateLists = () => {
            participants = namesArea.value.split('\n').filter(n => n.trim() !== '');
            availableParticipants = [...participants];
            resultDisplay.textContent = '';
            drawWheel(ctx, 250, availableParticipants, currentAngle);
        };
        
        const startSpin = () => {
            if (isSpinning || availableParticipants.length < 1) return;
            
            // --- Lógica del Modo Enfoque ---
            const overlay = document.createElement('div');
            overlay.className = 'sp-overlay';
            
            const focusWheelWrapper = document.createElement('div');
            focusWheelWrapper.className = 'sp-wheel-wrapper focus-wheel';

            const focusCanvas = document.createElement('canvas');
            focusCanvas.width = 500;
            focusCanvas.height = 500;
            const focusCtx = focusCanvas.getContext('2d');
            
            const focusPointer = document.createElement('div');
            focusPointer.className = 'sp-pointer';

            focusWheelWrapper.appendChild(focusCanvas);
            focusWheelWrapper.appendChild(focusPointer);
            overlay.appendChild(focusWheelWrapper);
            document.body.appendChild(overlay);
            
            // --- Fin de la lógica del Modo Enfoque ---

            isSpinning = true;
            spinBtn.disabled = true;
            resultDisplay.textContent = 'Girando...';

            const spinDuration = 4000;
            const randomExtraRotation = Math.random() * 2 * Math.PI;
            const totalRotation = 10 * 2 * Math.PI + randomExtraRotation;
            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const easeOut = t => 1 - Math.pow(1 - t, 3);
                const t = Math.min(progress / spinDuration, 1);
                
                let angle = totalRotation * easeOut(t);
                
                // Dibuja en ambos canvas
                drawWheel(ctx, 250, availableParticipants, angle);
                drawWheel(focusCtx, 500, availableParticipants, angle);

                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    currentAngle = angle % (2 * Math.PI);
                    const numSegments = availableParticipants.length;
                    const segmentAngle = (2 * Math.PI) / numSegments;
                    const pointerAngle = 1.5 * Math.PI;
                    const winningIndex = Math.floor((2 * Math.PI - currentAngle + pointerAngle) % (2 * Math.PI) / segmentAngle);
                    
                    const winner = availableParticipants[winningIndex];
                    resultDisplay.textContent = `¡${winner}!`;

                    const participantIndex = participants.indexOf(winner);
                    if (participantIndex > -1) participants.splice(participantIndex, 1);
                    availableParticipants.splice(winningIndex, 1);

                    isSpinning = false;
                    spinBtn.disabled = false;
                    
                    overlay.remove(); // Cierra la vista de enfoque
                }
            }
            requestAnimationFrame(animate);
        }
        
        resetBtn.addEventListener('click', updateLists);
        namesArea.addEventListener('input', updateLists);
        spinBtn.addEventListener('click', startSpin);

        updateLists();
    }
};