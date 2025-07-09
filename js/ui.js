// js/ui.js
import { makeWidgetDraggable } from './utils.js';
import { tools } from './widgets/index.js';

const screen = document.getElementById('screen');
const toolbar = document.getElementById('toolbar');
const tooltip = document.getElementById('custom-tooltip');

let highestZ = 100;
let isAudioContextStarted = false;

// Inicia el contexto de audio de Tone.js si es necesario
async function startAudioContext() {
    if (!isAudioContextStarted && window.Tone) {
        try {
            await Tone.start();
            isAudioContextStarted = true;
        } catch (e) {
            console.error("No se pudo iniciar el contexto de audio:", e);
        }
    }
}

// Crea y añade un nuevo widget a la pantalla
async function createWidget(toolId, title) {
    await startAudioContext();

    const widget = document.createElement('div');
    widget.dataset.toolId = toolId;
    widget.className = 'widget';
    widget.style.left = `${Math.random() * (window.innerWidth - 400)}px`;
    widget.style.top = `${Math.random() * (window.innerHeight - 400)}px`;
    highestZ++;
    widget.style.zIndex = highestZ;
    widget.innerHTML = `
        <div class="widget-header">
            <span>${title}</span>
            <button class="widget-close-btn">×</button>
        </div>
        <div class="widget-body"></div>
    `;

    screen.appendChild(widget);

    widget.querySelector('.widget-close-btn').addEventListener('click', () => {
        if (widget.cleanup) widget.cleanup(); // Llama a la función de limpieza si existe
        widget.remove();
    });

    makeWidgetDraggable(widget);

    // Obtiene el contenido y la lógica del widget desde el módulo de widgets
    const toolContent = tools[toolId];
    if (toolContent) {
        widget.querySelector('.widget-body').innerHTML = toolContent.html;
        toolContent.initializer(widget);
    }
}

// Configura los eventos para la barra de herramientas
function setupToolbarEvents() {
    toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('.tool-btn');
        if (!button) return;
        createWidget(button.dataset.tool, button.dataset.title);
    });
}

// Configura los eventos para el tooltip
function setupTooltipEvents() {
    toolbar.addEventListener('mouseover', (e) => {
        const button = e.target.closest('.tool-btn');
        if (!button || !button.dataset.title) return;
        
        tooltip.textContent = button.dataset.title;
        tooltip.style.display = 'block';
        const btnRect = button.getBoundingClientRect();
        tooltip.style.left = `${btnRect.left + btnRect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${btnRect.top - tooltip.offsetHeight - 8}px`;
    });

    toolbar.addEventListener('mouseout', (e) => {
        if (e.target.closest('.tool-btn')) {
            tooltip.style.display = 'none';
        }
    });
}

// Función principal de inicialización que se exporta
export function initializeToolbar() {
    setupToolbarEvents();
    setupTooltipEvents();
}