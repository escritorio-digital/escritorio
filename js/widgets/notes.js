// js/widgets/notes.js

/**
 * Widget de Bloc de Notas
 * Un área de texto simple para tomar notas rápidas.
 */
export const notes = {
    html: `<textarea class="w-full h-full p-2 text-lg notes-area" placeholder="Escribe aquí..." style="min-height: 150px;"></textarea>`,
    initializer: (widget) => {
        // No se requiere lógica de inicialización compleja.
    }
};
