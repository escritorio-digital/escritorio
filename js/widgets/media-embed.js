// js/widgets/media-embed.js

/**
 * Widget de Agregador de Medios
 * Incrusta videos de YouTube, imágenes o sitios web a partir de una URL.
 */
export const mediaEmbed = {
    html: `
        <div class="flex flex-col h-full">
            <div class="flex gap-2 mb-2">
                <input type="text" class="media-url-input flex-grow" placeholder="Pega una URL de YouTube, imagen o web...">
                <button class="media-load-btn btn-primary">Cargar</button>
            </div>
            <div class="media-embed-container flex-grow bg-black/20 rounded"></div>
            <p class="text-xs text-center mt-1">Nota: Algunas páginas web pueden no permitir ser incrustadas.</p>
        </div>`,
    initializer: (widget) => {
        const urlInput = widget.querySelector('.media-url-input');
        const loadBtn = widget.querySelector('.media-load-btn');
        const container = widget.querySelector('.media-embed-container');

        const loadMedia = () => {
            const url = urlInput.value.trim();
            if (!url) return;

            container.innerHTML = ''; // Limpiar contenido anterior

            // Coincidencia para YouTube
            const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (youtubeMatch && youtubeMatch[1]) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                container.appendChild(iframe);
            } 
            // Coincidencia para Imágenes
            else if (/\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url)) {
                const img = document.createElement('img');
                img.src = url;
                img.style.objectFit = 'contain';
                container.appendChild(img);
            } 
            // Otro sitio web
            else {
                const iframe = document.createElement('iframe');
                // Añadir https si falta para evitar errores de protocolo
                iframe.src = url.startsWith('http') ? url : `https://${url}`;
                container.appendChild(iframe);
            }
        };
        
        loadBtn.addEventListener('click', loadMedia);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadMedia();
        });
    }
};
