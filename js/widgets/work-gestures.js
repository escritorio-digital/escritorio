// js/widgets/work-gestures.js

/**
 * Widget de Gestos de Trabajo
 * Muestra tarjetas visuales para diferentes modos de trabajo en el aula.
 */
export const workGestures = {
    html: `
        <div class="grid grid-cols-2 gap-4">
            <div class="gesture-card"><div class="icon">🤫</div><div class="font-semibold">Silencio</div></div>
            <div class="gesture-card"><div class="icon">🗣️</div><div class="font-semibold">Hablar Bajo</div></div>
            <div class="gesture-card"><div class="icon">🧑‍🤝‍🧑</div><div class="font-semibold">Hablar con el compañero</div></div>
            <div class="gesture-card"><div class="icon">👨‍👩‍👧‍👦</div><div class="font-semibold">Trabajo en Equipo</div></div>
        </div>`,
    initializer: (widget) => {
        const cards = widget.querySelectorAll('.gesture-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }
};
