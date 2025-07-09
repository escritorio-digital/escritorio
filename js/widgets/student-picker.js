// js/widgets/student-picker.js

/**
 * Widget de Selector Aleatorio
 * Elige un nombre al azar de una lista, sin repetición hasta reiniciar.
 */
export const studentPicker = {
    html: `
        <div class="flex flex-col h-full">
            <h3 class="text-lg font-semibold">Lista</h3>
            <textarea class="sp-names w-full h-24 p-2 mb-2" placeholder="Un nombre por línea..."></textarea>
            <div class="flex items-center gap-2 mb-2">
                <p class="text-sm">Restantes: <span class="sp-student-count font-bold">0</span></p>
                <button class="sp-reset py-1 px-3 btn-tertiary">Reiniciar</button>
            </div>
            <div class="sp-result w-full h-24 flex items-center justify-center bg-[#F4F8D3] rounded-lg text-3xl font-bold p-4 mb-2" style="color: var(--color-text-dark);">?</div>
            <button class="sp-pick w-full btn-secondary text-lg">¡Seleccionar!</button>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.sp-names');
        const pickBtn = widget.querySelector('.sp-pick');
        const resetBtn = widget.querySelector('.sp-reset');
        const resultDiv = widget.querySelector('.sp-result');
        const countSpan = widget.querySelector('.sp-student-count');
        let allStudents = [];
        let availableStudents = [];

        const updateLists = () => {
            const names = namesArea.value.split('\n').filter(n => n.trim() !== '');
            allStudents = [...names];
            availableStudents = [...names];
            countSpan.textContent = availableStudents.length;
        };

        namesArea.addEventListener('input', updateLists);
        resetBtn.addEventListener('click', updateLists);

        pickBtn.addEventListener('click', () => {
            if (availableStudents.length === 0) {
                resultDiv.textContent = allStudents.length > 0 ? 'Reinicia' : 'Añade';
                return;
            }
            pickBtn.disabled = true;
            let animationInterval = setInterval(() => {
                resultDiv.textContent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
            }, 100);

            setTimeout(() => {
                clearInterval(animationInterval);
                const pickedIndex = Math.floor(Math.random() * availableStudents.length);
                resultDiv.textContent = availableStudents.splice(pickedIndex, 1)[0] || '?';
                countSpan.textContent = availableStudents.length;
                pickBtn.disabled = false;
            }, 2000);
        });
        updateLists();
    }
};
