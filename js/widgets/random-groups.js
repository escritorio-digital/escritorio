// js/widgets/random-groups.js

/**
 * Widget de Grupos Aleatorios
 * Divide una lista de nombres en grupos aleatorios.
 */
export const randomGroups = {
    html: `
        <div class="flex flex-col h-full">
            <h3 class="text-lg font-semibold">Alumnos</h3>
            <textarea class="rg-names w-full flex-grow p-2 mb-2" placeholder="Un nombre por línea..." style="min-height: 100px;"></textarea>
            <div class="flex gap-2 items-end">
                <div class="flex-grow"><label class="text-sm">Nº Grupos</label><input type="number" min="1" class="rg-group-count w-full p-1"></div>
                <div class="text-center font-bold pb-2">o</div>
                <div class="flex-grow"><label class="text-sm">Alumnos/Grupo</label><input type="number" min="1" class="rg-students-per-group w-full p-1"></div>
            </div>
            <button class="rg-generate mt-2 w-full btn-primary">Generar</button>
            <div class="rg-results mt-2 overflow-y-auto"></div>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.rg-names');
        const groupCountInput = widget.querySelector('.rg-group-count');
        const studentsPerGroupInput = widget.querySelector('.rg-students-per-group');
        const generateBtn = widget.querySelector('.rg-generate');
        const resultsDiv = widget.querySelector('.rg-results');

        groupCountInput.addEventListener('input', () => { if (groupCountInput.value) studentsPerGroupInput.value = ''; });
        studentsPerGroupInput.addEventListener('input', () => { if (studentsPerGroupInput.value) groupCountInput.value = ''; });

        generateBtn.addEventListener('click', () => {
            let names = namesArea.value.split('\n').filter(n => n.trim() !== '');
            if (names.length === 0) {
                resultsDiv.innerHTML = `<p style="color:var(--color-text-dark)">Añade nombres.</p>`;
                return;
            }
            // Shuffle names
            for (let i = names.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [names[i], names[j]] = [names[j], names[i]];
            }

            const groupCount = parseInt(groupCountInput.value, 10);
            const studentsPerGroup = parseInt(studentsPerGroupInput.value, 10);
            let groups = [];

            if (groupCount > 0) {
                for (let i = 0; i < groupCount; i++) groups.push([]);
                names.forEach((name, i) => groups[i % groupCount].push(name));
            } else if (studentsPerGroup > 0) {
                for (let i = 0; i < names.length; i += studentsPerGroup) {
                    groups.push(names.slice(i, i + studentsPerGroup));
                }
            } else {
                resultsDiv.innerHTML = `<p style="color:var(--color-text-dark)">Elige una opción de agrupación.</p>`;
                return;
            }

            resultsDiv.innerHTML = groups.map((g, i) => `
                <div class="p-2 mt-1 bg-[#F4F8D3] text-black rounded">
                    <h4 class="font-bold">Grupo ${i + 1}</h4>
                    <ul>${g.map(m => `<li>${m}</li>`).join('')}</ul>
                </div>`).join('');
        });
    }
};
