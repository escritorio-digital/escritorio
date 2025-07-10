// js/main.js
import { initializeToolbar } from './ui.js';

/**
 * Inicializa la información del "pizarrón".
 */
function initializeSessionInfo() {
    const dateEl = document.getElementById('whiteboard-date');
    const topicEl = document.getElementById('whiteboard-topic');
    const objectiveEl = document.getElementById('whiteboard-objective');

    // 1. Muestra la fecha actual
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('es-ES', options);

    // 2. Añade los placeholders como atributos HTML
    topicEl.setAttribute('placeholder', 'Clic para añadir tema...');
    objectiveEl.setAttribute('placeholder', 'Clic para añadir objetivo...');

    // 3. Carga los datos guardados de localStorage
    topicEl.textContent = localStorage.getItem('sessionTopic') || '';
    objectiveEl.textContent = localStorage.getItem('sessionObjective') || '';

    // 4. Guarda los datos en localStorage cuando se editan
    topicEl.addEventListener('blur', () => {
        localStorage.setItem('sessionTopic', topicEl.textContent);
    });
    objectiveEl.addEventListener('blur', () => {
        localStorage.setItem('sessionObjective', objectiveEl.textContent);
    });
}

// Espera a que el DOM esté completamente cargado para empezar a trabajar.
document.addEventListener('DOMContentLoaded', () => {
    initializeToolbar();
    initializeSessionInfo();
});