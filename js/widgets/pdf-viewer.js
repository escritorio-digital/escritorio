// js/widgets/pdf-viewer.js

/**
 * Widget Lector de PDF
 * Permite cargar, visualizar y realizar resaltados y comentarios.
 */
export const pdfViewer = {
    html: `
        <div class="pdf-container flex flex-col h-full">
            <div class="pdf-toolbar">
                <input type="file" class="pdf-file-input" accept=".pdf" title="Cargar PDF">
                <button class="pdf-prev" title="Página anterior">◀</button>
                <span class="pdf-page-indicator">Página <span id="pdf-page-num">0</span> / <span id="pdf-page-count">0</span></span>
                <button class="pdf-next" title="Página siguiente">▶</button>
                <div class="pdf-tools">
                    <button class="tool-btn active" data-tool="highlight" title="Resaltar">🎨</button>
                    <button class="tool-btn" data-tool="comment" title="Comentar">💬</button>
                    <input type="color" id="highlighter-color" value="#FFFB00">
                </div>
            </div>
            <div class="pdf-viewer-area flex-grow">
                <canvas id="pdf-canvas"></canvas>
                <div id="pdf-annotation-layer" class="annotation-layer"></div>
            </div>
        </div>
    `,
    initializer: (widget) => {
        const fileInput = widget.querySelector('.pdf-file-input');
        const canvas = widget.querySelector('#pdf-canvas');
        const annotationLayer = widget.querySelector('#pdf-annotation-layer');
        const ctx = canvas.getContext('2d');
        const pageNumEl = widget.querySelector('#pdf-page-num');
        const pageCountEl = widget.querySelector('#pdf-page-count');
        const prevBtn = widget.querySelector('.pdf-prev');
        const nextBtn = widget.querySelector('.pdf-next');
        const colorPicker = widget.querySelector('#highlighter-color');
        const toolBtns = widget.querySelectorAll('.pdf-tools .tool-btn');

        let pdfDoc = null, pageNum = 1, pageRendering = false, annotations = {};
        let currentTool = 'highlight'; // Herramienta activa por defecto

        const { pdfjsLib } = globalThis;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.mjs`;

        const renderPage = (num) => {
            pageRendering = true;
            pdfDoc.getPage(num).then(page => {
                const viewport = page.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                annotationLayer.style.height = `${viewport.height}px`;
                annotationLayer.style.width = `${viewport.width}px`;
                page.render({ canvasContext: ctx, viewport }).promise.then(() => {
                    pageRendering = false;
                    drawAnnotations(num);
                });
            });
            pageNumEl.textContent = num;
        };

        const drawAnnotations = (num) => {
            annotationLayer.innerHTML = '';
            if (!annotations[num]) return;
            annotations[num].forEach((anno, index) => {
                const el = document.createElement('div');
                if (anno.type === 'highlight') {
                    el.className = 'highlight';
                    el.style.backgroundColor = anno.color;
                } else if (anno.type === 'comment') {
                    el.className = 'comment-pin';
                    el.innerHTML = '💬';
                    el.title = anno.text;
                }
                el.style.left = `${anno.x}px`;
                el.style.top = `${anno.y}px`;
                if(anno.width) el.style.width = `${anno.width}px`;
                if(anno.height) el.style.height = `${anno.height}px`;
                el.dataset.index = index;
                annotationLayer.appendChild(el);
            });
        };

        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file || file.type !== 'application/pdf') return;
            const fileReader = new FileReader();
            fileReader.onload = () => {
                pdfjsLib.getDocument(new Uint8Array(fileReader.result)).promise.then(pdf => {
                    pdfDoc = pdf;
                    pageCountEl.textContent = pdf.numPages;
                    pageNum = 1;
                    annotations = {};
                    renderPage(pageNum);
                });
            };
            fileReader.readAsArrayBuffer(file);
        });

        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentTool = btn.dataset.tool;
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                annotationLayer.style.cursor = currentTool === 'highlight' ? 'crosshair' : 'pointer';
            });
        });

        let isDrawing = false, startX, startY, currentHighlight;
        annotationLayer.addEventListener('mousedown', e => {
            if (!pdfDoc || e.target !== annotationLayer) return;

            if (currentTool === 'highlight') {
                isDrawing = true;
                startX = e.offsetX;
                startY = e.offsetY;
                currentHighlight = document.createElement('div');
                currentHighlight.className = 'highlight-preview';
                currentHighlight.style.left = `${startX}px`;
                currentHighlight.style.top = `${startY}px`;
                currentHighlight.style.backgroundColor = colorPicker.value;
                annotationLayer.appendChild(currentHighlight);
            } else if (currentTool === 'comment') {
                const text = prompt('Escribe tu comentario:');
                if (text) {
                    if (!annotations[pageNum]) annotations[pageNum] = [];
                    annotations[pageNum].push({ type: 'comment', text, x: e.offsetX, y: e.offsetY });
                    drawAnnotations(pageNum);
                }
            }
        });

        annotationLayer.addEventListener('mousemove', e => {
            if (!isDrawing || currentTool !== 'highlight') return;
            const width = Math.abs(e.offsetX - startX);
            const height = Math.abs(e.offsetY - startY);
            currentHighlight.style.width = `${width}px`;
            currentHighlight.style.height = `${height}px`;
            currentHighlight.style.left = `${Math.min(startX, e.offsetX)}px`;
            currentHighlight.style.top = `${Math.min(startY, e.offsetY)}px`;
        });

        annotationLayer.addEventListener('mouseup', e => {
            if (!isDrawing || currentTool !== 'highlight') return;
            isDrawing = false;
            if (!annotations[pageNum]) annotations[pageNum] = [];
            annotations[pageNum].push({
                type: 'highlight',
                x: parseInt(currentHighlight.style.left),
                y: parseInt(currentHighlight.style.top),
                width: parseInt(currentHighlight.style.width),
                height: parseInt(currentHighlight.style.height),
                color: currentHighlight.style.backgroundColor
            });
            currentHighlight.remove();
            drawAnnotations(pageNum);
        });

        prevBtn.addEventListener('click', () => { if (pdfDoc && pageNum > 1) renderPage(--pageNum); });
        nextBtn.addEventListener('click', () => { if (pdfDoc && pageNum < pdfDoc.numPages) renderPage(++pageNum); });
    }
};