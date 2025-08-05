import React, { useState, useRef } from 'react';
import type { FC } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import { Upload, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import './ImageCarousel.css';

// El componente principal del carrusel de imágenes
export const ImageCarouselWidget: FC = () => {
  const [images, setImages] = useLocalStorage<string[]>('image-carousel-images', []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador para la selección de archivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const imagePromises: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        // Convertimos cada imagen a una URL de datos (Base64) para poder guardarla
        const promise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
        imagePromises.push(promise);
      }
    }

    Promise.all(imagePromises).then(newImages => {
      setImages(newImages);
      setCurrentIndex(0);
    });
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="image-carousel-widget">
      {images.length === 0 ? (
        // Vista cuando no hay imágenes cargadas
        <div className="placeholder-view">
          <ImageIcon size={64} className="text-gray-400" />
          <p className="mt-4 text-center">No hay imágenes cargadas.</p>
          <button onClick={() => fileInputRef.current?.click()} className="upload-button">
            <Upload size={18} />
            Seleccionar Imágenes
          </button>
        </div>
      ) : (
        // Vista del carrusel
        <div className="carousel-view">
          <div className="carousel-image-container">
            <img src={images[currentIndex]} alt={`Diapositiva ${currentIndex + 1}`} />
          </div>
          
          {/* Controles de Navegación */}
          <button className="carousel-arrow left-arrow" onClick={goToPrevious}><ChevronLeft size={32} /></button>
          <button className="carousel-arrow right-arrow" onClick={goToNext}><ChevronRight size={32} /></button>
          
          {/* Indicadores de Diapositiva */}
          <div className="slide-indicators">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`indicator-dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          {/* Botón para cambiar las imágenes */}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="change-images-button" 
            title="Seleccionar nuevas imágenes"
          >
            <Upload size={16} />
          </button>
        </div>
      )}
      
      {/* Input de archivo, siempre oculto */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

// Objeto de configuración del widget
export const widgetConfig: Omit<WidgetConfig, 'component'> = {
  id: 'image-carousel',
  title: 'Carrusel de Imágenes',
  icon: <img src="/escritorio/icons/ImageCarousel.png" alt="Carrusel de Imágenes" width="52" height="52" />,
  defaultSize: { width: 500, height: 400 },
};