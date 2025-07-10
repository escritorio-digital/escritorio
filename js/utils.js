// js/utils.js

/**
 * Hace que un elemento de widget sea arrastrable por su cabecera.
 * @param {HTMLElement} widget - El elemento del widget que se hará arrastrable.
 */
export function makeWidgetDraggable(widget) {
    const header = widget.querySelector('.widget-header');
    let isDragging = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
        isDragging = true;
        
        // Asegura que el evento sea de ratón o el primer toque
        const event = e.type === 'touchstart' ? e.touches[0] : e;

        offsetX = event.clientX - widget.offsetLeft;
        offsetY = event.clientY - widget.offsetTop;

        // Coloca el widget en la parte superior al hacer clic
        const highestZ = Math.max(...Array.from(document.querySelectorAll('.widget'), el => parseFloat(el.style.zIndex) || 0));
        widget.style.zIndex = highestZ + 1;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        
        // Evita el comportamiento por defecto en pantallas táctiles (como el scroll)
        e.preventDefault();
        
        const event = e.type === 'touchmove' ? e.touches[0] : e;
        
        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        // Limita el movimiento dentro de la ventana
        const screen = document.getElementById('screen');
        newLeft = Math.max(0, Math.min(newLeft, screen.clientWidth - widget.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, screen.clientHeight - widget.offsetHeight));

        widget.style.left = `${newLeft}px`;
        widget.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
    };

    header.addEventListener('mousedown', onMouseDown);
    header.addEventListener('touchstart', onMouseDown);
}

/**
 * Reproduce un archivo de sonido desde la carpeta /sounds.
 * Esta versión devuelve la Promesa para un manejo de errores correcto.
 * @param {string} soundFile - El nombre del archivo de sonido.
 * @returns {Promise}
 */
export function playSound(soundFile) {
    const audio = new Audio(`sounds/${soundFile}`);
    // Devolvemos la promesa que genera el método .play()
    return audio.play();
}