// js/widgets/qr-generator.js

/**
 * Widget de Generador QR
 * Crea un código QR a partir de texto o una URL.
 */
export const qrGenerator = {
    html: `
        <div class="flex flex-col h-full text-center">
            <input type="text" class="qr-input mb-2" placeholder="Pega una URL o escribe texto...">
            <button class="qr-generate-btn btn-primary mb-2">Generar QR</button>
            <div class="qr-output flex-grow flex items-center justify-center bg-white rounded"></div>
        </div>`,
    initializer: (widget) => {
        const input = widget.querySelector('.qr-input');
        const btn = widget.querySelector('.qr-generate-btn');
        const output = widget.querySelector('.qr-output');

        const generateQR = () => {
            const text = input.value.trim();
            if (text && window.qrcode) {
                output.innerHTML = '';
                try {
                    const qr = qrcode(0, 'M'); // type 0, error correction 'M'
                    qr.addData(text);
                    qr.make();
                    output.innerHTML = qr.createImgTag(6, 8); // (cell size, margin)
                } catch (e) {
                    output.textContent = "Error al generar el QR.";
                    console.error(e);
                }
            }
        };

        btn.addEventListener('click', generateQR);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateQR();
        });
    }
};
