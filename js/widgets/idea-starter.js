// js/widgets/idea-starter.js

/**
 * Widget de Disparador de Ideas
 * Genera ideas o preguntas aleatorias a partir de categorías predefinidas.
 */
export const ideaStarter = {
    html: `
        <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Categoría</h3>
            <div class="is-categories flex justify-center flex-wrap gap-2 mb-3">
                <button data-category="historias" class="category-btn btn-primary">Historias</button>
                <button data-category="historiasMusicales" class="category-btn btn-primary">H. Musicales</button>
                <button data-category="debate" class="category-btn btn-primary">Debate</button>
                <button data-category="debatesMusicales" class="category-btn btn-primary">D. Musicales</button>
            </div>
            <div class="is-result w-full min-h-[8rem] flex items-center justify-center bg-[#F4F8D3] rounded-lg p-4 text-xl" style="color: var(--color-text-dark);">...</div>
            <button class="is-generate mt-3 w-full btn-secondary text-lg" disabled>Generar Idea</button>
        </div>`,
    initializer: (widget) => {
        const prompts = {
            historias: ["Un reloj que detiene el tiempo, pero pierdes un recuerdo.", "Un mapa antiguo de un lugar desconocido.", "Los pájaros empiezan a volar hacia atrás.", "El último dragón vive en el metro.", "Un robot de limpieza desarrolla conciencia."],
            historiasMusicales: ["Una guitarra que toca canciones del futuro.", "Un pueblo donde está prohibido cantar.", "Un fantasma que se comunica con un piano.", "Una banda de música que viaja en el tiempo.", "Un bosque cuyos árboles suenan con el viento."],
            debate: ["¿Volar o ser invisible?", "¿Eliminarías las emociones negativas?", "¿Derechos para los robots?", "¿Libertad o seguridad?", "¿Conocimiento o imaginación?"],
            debatesMusicales: ["¿Letra o melodía?", "Un solo género musical para siempre, ¿cuál?", "¿Puede la IA crear música con emoción?", "¿Es justo usar 'samples'?", "¿Censurar música controvertida?"]
        };
        const categoryBtns = widget.querySelectorAll('.category-btn');
        const resultDiv = widget.querySelector('.is-result');
        const generateBtn = widget.querySelector('.is-generate');
        let selectedCategory = null;

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedCategory = btn.dataset.category;
                categoryBtns.forEach(b => { b.classList.remove('btn-secondary'); b.classList.add('btn-primary'); });
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
                generateBtn.disabled = false;
                resultDiv.textContent = `Categoría "${btn.textContent}" seleccionada.`;
            });
        });

        generateBtn.addEventListener('click', () => {
            if (selectedCategory && prompts[selectedCategory]) {
                resultDiv.textContent = prompts[selectedCategory][Math.floor(Math.random() * prompts[selectedCategory].length)];
            }
        });
    }
};
