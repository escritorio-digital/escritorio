// js/widgets/work-list.js

/**
 * Widget de Lista de Trabajo
 * Una lista de tareas simple para añadir y marcar como completadas.
 */
export const workList = {
    html: `
        <div class="flex flex-col h-full">
            <input type="text" class="work-list-input mb-2" placeholder="Añadir nueva tarea y pulsar Enter...">
            <ul class="work-list-ul flex-grow overflow-y-auto"></ul>
        </div>`,
    initializer: (widget) => {
        const input = widget.querySelector('.work-list-input');
        const ul = widget.querySelector('.work-list-ul');

        const addTask = (taskText) => {
            const text = taskText.trim();
            if (text === '') return;
            
            const li = document.createElement('li');
            li.innerHTML = `<input type="checkbox" class="task-checkbox"><label class="flex-grow">${text}</label>`;
            ul.appendChild(li);
            input.value = '';

            li.querySelector('.task-checkbox').addEventListener('change', (e) => {
                li.classList.toggle('completed', e.target.checked);
            });
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(input.value);
            }
        });
    }
};
