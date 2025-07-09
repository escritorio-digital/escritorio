// js/widgets/sound-meter.js

/**
 * Widget de Medidor de Sonido
 * Muestra el nivel de ruido ambiental utilizando el micrófono.
 */
export const soundMeter = {
    html: `
        <div class="text-center">
            <div class="noise-permission-request">
                <p class="mb-4">Necesita permiso para usar tu micrófono.</p>
                <button class="noise-start btn-primary">Activar</button>
            </div>
            <div class="noise-meter-container hidden">
                <div class="w-full h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-[#A6D6D6]">
                    <div class="noise-bar h-full rounded-full" style="width:0%; transition: width 0.1s linear, background-color 0.5s linear;"></div>
                </div>
                <p class="noise-level-text text-lg font-medium mt-2">Silencio</p>
            </div>
        </div>`,
    initializer: (widget) => {
        const startBtn = widget.querySelector('.noise-start');
        const permissionDiv = widget.querySelector('.noise-permission-request');
        const meterDiv = widget.querySelector('.noise-meter-container');
        const noiseBar = widget.querySelector('.noise-bar');
        const levelText = widget.querySelector('.noise-level-text');
        let audioContext, microphone, scriptNode;

        async function start() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                permissionDiv.classList.add('hidden');
                meterDiv.classList.remove('hidden');

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                scriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;

                microphone.connect(analyser);
                analyser.connect(scriptNode);
                scriptNode.connect(audioContext.destination);

                scriptNode.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    const average = array.reduce((a, b) => a + b, 0) / array.length;
                    updateMeter(average);
                };

                // Función de limpieza
                widget.cleanup = () => {
                    if (microphone) microphone.mediaStream.getTracks().forEach(track => track.stop());
                    if (audioContext) audioContext.close();
                    if (scriptNode) scriptNode.onaudioprocess = null;
                };
            } catch (err) {
                meterDiv.innerHTML = `<p style="color:var(--color-text-dark)">No se pudo acceder al micrófono.</p>`;
                permissionDiv.classList.add('hidden');
                meterDiv.classList.remove('hidden');
            }
        }

        function updateMeter(level) {
            const percentage = Math.min(100, Math.max(0, level * 1.5));
            noiseBar.style.width = percentage + '%';
            if (percentage < 30) {
                noiseBar.style.backgroundColor = '#A6D6D6';
                levelText.textContent = 'Silencio';
            } else if (percentage < 60) {
                noiseBar.style.backgroundColor = '#a8c030';
                levelText.textContent = 'Conversación';
            } else {
                noiseBar.style.backgroundColor = '#d9534f';
                levelText.textContent = '¡Ruido!';
            }
        }

        startBtn.addEventListener('click', start);
    }
};
