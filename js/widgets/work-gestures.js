// js/widgets/work-gestures.js

/**
 * Widget de Gestos de Trabajo
 * Muestra un gesto seleccionado en grande y una lista de miniaturas para elegir.
 */
export const workGestures = {
    html: `
        <div class="gestures-container">
            <div class="gesture-display">
                <div class="icon">👇</div>
                <div class="font-semibold">Elige un gesto</div>
            </div>

            <div class="gesture-thumbnails">
                <div class="gesture-thumbnail active" data-icon="🤫" data-text="Silencio">
                    <div class="icon">🤫</div>
                    <div class="text">Silencio</div>
                </div>
                <div class="gesture-thumbnail" data-icon="🗣️" data-text="Hablar Bajo">
                    <div class="icon">🗣️</div>
                    <div class="text">Hablar Bajo</div>
                </div>
                <div class="gesture-thumbnail" data-icon="🧑‍🤝‍🧑" data-text="Hablar con el compañero">
                    <div class="icon">🧑‍🤝‍🧑</div>
                    <div class="text">Compañero</div>
                </div>
                <div class="gesture-thumbnail" data-icon="👨‍👩‍👧‍👦" data-text="Trabajo en Equipo">
                    <div class="icon">👨‍👩‍👧‍👦</div>
                    <div class="text">Equipo</div>
                </div>
            </div>
        </div>
    `,
    initializer: (widget) => {
        const display = widget.querySelector('.gesture-display');
        const thumbnails = widget.querySelectorAll('.gesture-thumbnail');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Obtiene los datos del gesto de la miniatura clicada
                const icon = thumbnail.dataset.icon;
                const text = thumbnail.dataset.text;

                // Actualiza la vista principal con el nuevo gesto
                display.innerHTML = `
                    <div class="icon">${icon}</div>
                    <div class="font-semibold">${text}</div>
                `;

                // Gestiona la clase 'active' para resaltar la miniatura seleccionada
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });
    }
};