// js/widgets/student-picker.js

/**
 * Widget de Selector Aleatorio (Ruleta)
 * Elige un nombre al azar de una lista usando una ruleta giratoria.
 */
export const studentPicker = {
    html: `
        <div class="sp-container flex flex-col h-full items-center">
            <h3 class="text-lg font-semibold mb-1">Participantes</h3>
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
        const canvas = widget.querySelector('#sp-canvas');
        const namesArea = widget.querySelector('.sp-names');
        const spinBtn = widget.querySelector('.sp-spin-btn');
        const resetBtn = widget.querySelector('.sp-reset-btn');
        const resultDisplay = widget.querySelector('.sp-result-display');
        const ctx = canvas.getContext('2d');

        let availableParticipants = [];
        const colors = ["#F7CFD8", "#8E7DBE", "#A6D6D6", "#F4F8D3", "#d9534f", "#a8c030", "#7b69b1"];
        let currentAngle = 0;
        let isSpinning = false;

        const drawWheel = () => {
            const numSegments = availableParticipants.length;
            ctx.clearRect(0, 0, 250, 250);
            if (numSegments === 0) return;
            
            const segmentAngle = (2 * Math.PI) / numSegments;
            
            ctx.save();
            ctx.translate(125, 125); // Mueve el origen al centro del canvas
            ctx.rotate(currentAngle); // Rota el canvas entero
            
            for (let i = 0; i < numSegments; i++) {
                ctx.beginPath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.moveTo(0, 0); // Empieza a dibujar desde el centro
                ctx.arc(0, 0, 125, i * segmentAngle, (i + 1) * segmentAngle);
                ctx.closePath();
                ctx.fill();
                
                // Dibuja el nombre en cada segmento
                ctx.save();
                ctx.fillStyle = "#493e6a";
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const textAngle = (i * segmentAngle) + (segmentAngle / 2);
                ctx.rotate(textAngle);
                ctx.fillText(availableParticipants[i], 75, 0); // Dibuja el texto
                ctx.restore();
            }
            ctx.restore(); // Restaura el canvas a su estado original
        };

        const updateLists = () => {
            const participants = namesArea.value.split('\n').filter(n => n.trim() !== '');
            availableParticipants = [...participants];
            resultDisplay.textContent = '';
            drawWheel();
        };

        const spin = () => {
            if (isSpinning || availableParticipants.length < 1) return;
            isSpinning = true;
            spinBtn.disabled = true;
            resultDisplay.textContent = 'Girando...';

            const spinDuration = 4000; // 4 segundos de giro
            const randomExtraRotation = Math.random() * 2 * Math.PI;
            const totalRotation = 10 * 2 * Math.PI + randomExtraRotation; // Girar al menos 10 veces
            let start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const easeOut = t => 1 - Math.pow(1 - t, 3); // Efecto de desaceleración
                const t = Math.min(progress / spinDuration, 1);
                
                currentAngle = totalRotation * easeOut(t);
                drawWheel();

                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    const finalAngle = currentAngle % (2 * Math.PI);
                    const numSegments = availableParticipants.length;
                    const segmentAngle = (2 * Math.PI) / numSegments;
                    
                    const pointerAngle = 1.5 * Math.PI; // El puntero está arriba (270 grados)
                    const winningIndex = Math.floor((2 * Math.PI - finalAngle + pointerAngle) % (2 * Math.PI) / segmentAngle);
                    
                    const winner = availableParticipants[winningIndex];
                    resultDisplay.textContent = `¡${winner}!`;

                    availableParticipants.splice(winningIndex, 1);
                    isSpinning = false;
                    spinBtn.disabled = false;
                }
            }
            requestAnimationFrame(animate);
        };
        
        namesArea.addEventListener('input', updateLists);
        resetBtn.addEventListener('click', updateLists);
        spinBtn.addEventListener('click', spin);

        updateLists();
    }
};