import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { WidgetConfig } from '../../../types';
import { Upload, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import './ImageCarousel.css';

// El componente principal del carrusel de imágenes
export const ImageCarouselWidget: FC = () => {
  const { t } = useTranslation();
  const [images, setImages] = useLocalStorage<string[]>('image-carousel-images', []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador para la selección de archivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('Files selected:', files?.length);
    if (!files || files.length === 0) return;

    const imagePromises: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('Processing file:', file.name, 'type:', file.type);
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
    console.log('Image promises created:', imagePromises.length);

    Promise.all(imagePromises).then(newImages => {
      console.log('Images loaded successfully:', newImages.length);
      console.log('Setting images to:', newImages);
      setImages(newImages);
      setCurrentIndex(0);
      // Limpiar el input para permitir seleccionar los mismos archivos de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };

  const goToPrevious = useCallback(() => {
    if (images.length <= 1) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    if (images.length <= 1) return;
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (images.length === 0) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, goToPrevious, goToNext]);

  // Debug: mostrar estado actual
  console.log('Current render state - images.length:', images.length, 'currentIndex:', currentIndex);

  return (
    <div className="image-carousel-widget">
      {images.length === 0 ? (
        // Vista cuando no hay imágenes cargadas
        <div className="placeholder-view">
          <ImageIcon size={64} className="text-gray-400" />
          <p className="mt-4 text-center">{t('widgets.image_carousel.no_images')}</p>
          <button onClick={() => fileInputRef.current?.click()} className="upload-button">
            <Upload size={18} />
            {t('widgets.image_carousel.select_images')}
          </button>
        </div>
      ) : (
        // Vista del carrusel
        <div className="carousel-view">
          <div className="carousel-image-container">
            <img src={images[currentIndex]} alt={t('widgets.image_carousel.slide_alt', { number: currentIndex + 1 })} />
            {/* Debug indicator */}
            <div style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '3px'}}>
              {currentIndex + 1} / {images.length}
              {images.length === 1 && <div style={{fontSize: '12px', marginTop: '3px'}}>Carga más imágenes para navegar</div>}
            </div>
          </div>
          
          {/* Controles de Navegación - Solo mostrar si hay más de 1 imagen */}
          {images.length > 1 && (
            <>
              <button className="carousel-arrow left-arrow" onClick={goToPrevious}><ChevronLeft size={32} /></button>
              <button className="carousel-arrow right-arrow" onClick={goToNext}><ChevronRight size={32} /></button>
            </>
          )}
          
          {/* Indicadores de Diapositiva - Solo mostrar si hay más de 1 imagen */}
          {images.length > 1 && (
            <div className="slide-indicators">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator-dot ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
          
          {/* Botón para cambiar las imágenes */}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="change-images-button" 
            title={t('widgets.image_carousel.select_new_images')}
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
  title: 'widgets.image_carousel.title',
  icon: <img src="/icons/ImageCarousel.png" alt="Image Carousel" width="52" height="52" />,
  defaultSize: { width: 500, height: 400 },
};