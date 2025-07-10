// js/widgets/work-list.js

/**
 * Widget de Lista de Trabajo
 * Una lista de tareas con funcionalidad CRUD y diseño de 3 columnas optimizado.
 */
export const workList = {
    html: `
        <div class="flex flex-col h-full">
            <input type="text" class="work-list-input mb-2" placeholder="Añadir nueva tarea y pulsar Enter...">
            <ul class="work-list-ul flex-grow overflow-y-auto pr-2"></ul>
        </div>`,
    initializer: (widget) => {
        const input = widget.querySelector('.work-list-input');
        const ul = widget.querySelector('.work-list-ul');

        const addTask = (taskText) => {
            const text = taskText.trim();
            if (text === '') return;
            
            const li = document.createElement('li');
            li.className = 'work-list-item'; // Clase principal para el contenedor de la tarea
            
            // Estructura: Checkbox, luego el Label, y al final el div de acciones
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <label class="task-label">${text}</label>
                <div class="task-actions">
                    <button class="edit-btn" title="Editar tarea">✏️</button>
                    <button class="delete-btn" title="Eliminar tarea">🗑️</button>
                </div>
            `;
            ul.appendChild(li);
            input.value = '';

            // --- MANEJADORES DE EVENTOS ---
            const label = li.querySelector('.task-label');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            // Marcar como completada
            li.querySelector('.task-checkbox').addEventListener('change', (e) => {
                li.classList.toggle('completed', e.target.checked);
            });

            // Eliminar la tarea
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });

            // Activar modo edición al hacer clic en el lápiz
            const activateEditMode = () => {
                const currentText = label.textContent;
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText;
                editInput.className = 'edit-input'; // Usará estilos específicos

                // Reemplaza el label con el input
                li.replaceChild(editInput, label);
                editInput.focus();

                const saveChanges = () => {
                    const newText = editInput.value.trim();
                    label.textContent = newText === '' ? currentText : newText; // Revierte si está vacío
                    // Devuelve el label al DOM
                    li.replaceChild(label, editInput);
                };

                editInput.addEventListener('blur', saveChanges);
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') editInput.blur();
                });
            };
            
            editBtn.addEventListener('click', activateEditMode);
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask(input.value);
        });
    }
};