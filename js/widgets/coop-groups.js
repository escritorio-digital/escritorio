// js/widgets/coop-groups.js

/**
 * Widget de Grupos Cooperativos
 * Crea grupos y asigna roles aleatorios a cada miembro.
 */
export const coopGroups = {
    html: `
        <div class="flex flex-col h-full">
            <h3 class="text-lg font-semibold">Alumnos</h3>
            <textarea class="cg-names w-full p-2 mb-2" placeholder="Un nombre por línea..." rows="4"></textarea>
            <h3 class="text-lg font-semibold">Roles</h3>
            <textarea class="cg-roles w-full p-2 mb-2" placeholder="Un rol por línea..." rows="3"></textarea>
            <label class="text-sm">Nº Grupos</label>
            <input type="number" min="1" class="cg-group-count w-full p-1 mb-2">
            <button class="cg-generate w-full btn-primary">Generar</button>
            <div class="cg-results mt-2 overflow-y-auto"></div>
        </div>`,
    initializer: (widget) => {
        const namesArea = widget.querySelector('.cg-names');
        const rolesArea = widget.querySelector('.cg-roles');
        const groupCountInput = widget.querySelector('.cg-group-count');
        const generateBtn = widget.querySelector('.cg-generate');
        const resultsDiv = widget.querySelector('.cg-results');

        generateBtn.addEventListener('click', () => {
            let names = namesArea.value.split('\n').filter(n => n.trim() !== '');
            let roles = rolesArea.value.split('\n').filter(r => r.trim() !== '');
            let groupCount = parseInt(groupCountInput.value, 10);

            if (names.length === 0 || roles.length === 0 || !groupCount) {
                resultsDiv.innerHTML = `<p style="color:var(--color-text-dark)">Rellena todos los campos.</p>`;
                return;
            }

            // Shuffle names and roles
            for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [names[i], names[j]] = [names[j], names[i]]; }
            for (let i = roles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [roles[i], roles[j]] = [roles[j], roles[i]]; }
            
            let groups = Array.from({ length: groupCount }, () => []);
            names.forEach((name, i) => groups[i % groupCount].push({ name }));
            
            groups.forEach(group => {
                let shuffledRoles = [...roles].sort(() => 0.5 - Math.random());
                group.forEach((member, i) => {
                    member.role = shuffledRoles[i % shuffledRoles.length];
                });
            });

            resultsDiv.innerHTML = groups.map((g, i) => `
                <div class="p-2 mt-1 bg-[#F4F8D3] text-black rounded">
                    <h4 class="font-bold">Grupo ${i + 1}</h4>
                    <ul>${g.map(m => `<li><span class="font-semibold">${m.name}:</span> ${m.role}</li>`).join('')}</ul>
                </div>`).join('');
        });
    }
};
