// js/widgets/traffic-light.js

/**
 * Widget de Semáforo
 * Un semáforo interactivo para gestionar el nivel de ruido o actividad.
 */
export const trafficLight = {
    html: `
        <div class="traffic-light-body">
            <div class="light red active"></div>
            <div class="light yellow"></div>
            <div class="light green"></div>
        </div>`,
    initializer: (widget) => {
        const lightBody = widget.querySelector('.traffic-light-body');
        const red = widget.querySelector('.red');
        const yellow = widget.querySelector('.yellow');
        const green = widget.querySelector('.green');
        let currentState = 0; // 0: red, 1: red+yellow, 2: green, 3: yellow

        lightBody.addEventListener('click', () => {
            currentState = (currentState + 1) % 4;
            red.classList.remove('active');
            yellow.classList.remove('active');
            green.classList.remove('active');
            switch (currentState) {
                case 0: red.classList.add('active'); break;
                case 1: red.classList.add('active'); yellow.classList.add('active'); break;
                case 2: green.classList.add('active'); break;
                case 3: yellow.classList.add('active'); break;
            }
        });
    }
};
