// js/widgets/notes.js

/**
 * Widget de Bloc de Notas con Texto Enriquecido
 * Un editor de texto basado en Quill.js para tomar notas con formato.
 */
export const notes = {
    html: `
        <div class="notes-container flex flex-col h-full">
            <div id="notes-toolbar">
                <span class="ql-formats">
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-strike"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered"></button>
                    <button class="ql-list" value="bullet"></button>
                </span>
                <span class="ql-formats">
                     <button class="ql-clean"></button>
                </span>
            </div>
            <div id="notes-editor" class="flex-grow"></div>
        </div>
    `,
    initializer: (widget) => {
        // Opciones de configuración para Quill
        const toolbarOptions = {
            container: widget.querySelector('#notes-toolbar'),
        };

        // Inicializa el editor Quill en el div '#notes-editor'
        const quill = new Quill(widget.querySelector('#notes-editor'), {
            theme: 'snow', // 'snow' es el tema por defecto con la barra de herramientas
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'Escribe aquí tus ideas...'
        });

        // Enfoca el editor automáticamente cuando se crea el widget
        quill.focus();
    }
};