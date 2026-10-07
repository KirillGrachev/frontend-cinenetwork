
import React, { useEffect, useCallback, useState, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import LoadingSpinner from '../LoadingSpinner';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
    isOpen, 
    onClose, 
    images, 
    initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync index when opening
  useEffect(() => {
      if (isOpen) {
          setCurrentIndex(initialIndex);
          setIsLoading(true);
          setHasError(false);
      }
  }, [isOpen, initialIndex]);

  // Reset state when index changes
  useEffect(() => {
      if (isOpen) {
          setIsLoading(true);
          setHasError(false);
      }
  }, [currentIndex, isOpen]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
          // Dialog handles Escape automatically
          if (e.key === 'ArrowRight') handleNext();
          if (e.key === 'ArrowLeft') handlePrev();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  const handleImageError = () => {
      setIsLoading(false);
      setHasError(true);
  };

  const handleImageLoad = () => {
      setIsLoading(false);
      setHasError(false);
  };

  if (images.length === 0) return null;

  return (
      <Dialog 
        open={isOpen} 
        as="div" 
        className="relative z-[100]" 
        onClose={onClose}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/95 backdrop-blur-sm transition duration-300 data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center p-0 text-center">
              <DialogPanel 
                transition
                className="w-full h-full flex items-center justify-center relative shadow-xl transform transition duration-300 data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                  
                  {/* Accessible Title (Visually Hidden but present for screen readers) */}
                  <DialogTitle className="sr-only">
                      Image Viewer - Image {currentIndex + 1} of {images.length}
                  </DialogTitle>

                  {/* Close Button */}
                  <button 
                      onClick={onClose}
                      className="absolute top-4 right-4 md:top-6 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md border border-white/10 focus:outline-none"
                      aria-label="Close viewer"
                  >
                      <i className="fa-solid fa-xmark text-xl"></i>
                  </button>

                  {/* Navigation Buttons */}
                  {images.length > 1 && (
                      <>
                          <button 
                              onClick={handlePrev}
                              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-50 border border-white/5 focus:outline-none"
                              aria-label="Previous image"
                          >
                              <i className="fa-solid fa-chevron-left text-xl"></i>
                          </button>
                          <button 
                              onClick={handleNext}
                              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-50 border border-white/5 focus:outline-none"
                              aria-label="Next image"
                          >
                              <i className="fa-solid fa-chevron-right text-xl"></i>
                          </button>
                      </>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-panel-primary/80 backdrop-blur-md border border-white/20 rounded-2xl text-sm font-bold text-white shadow-xl pointer-events-none z-50 flex items-center gap-2">
                      <i className="fa-regular fa-images text-gray-400"></i>
                      <span>{currentIndex + 1} / {images.length}</span>
                  </div>

                  {/* Image Container */}
                  <div 
                      className="relative w-full h-full p-4 md:p-12 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()} 
                  >
                      {hasError ? (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                                  <i className="fa-regular fa-image text-4xl opacity-30"></i>
                              </div>
                              <span className="text-base font-medium text-gray-400">Изображение недоступно</span>
                          </div>
                      ) : (
                          <>
                              {isLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <LoadingSpinner size="lg" />
                                  </div>
                              )}
                              <img 
                                  key={images[currentIndex]} 
                                  src={images[currentIndex]} 
                                  alt={`Slide ${currentIndex + 1}`} 
                                  className={`max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                  onLoad={handleImageLoad}
                                  onError={handleImageError}
                              />
                          </>
                      )}
                  </div>

              </DialogPanel>
          </div>
        </div>
      </Dialog>
  );
};

export default ImageViewer;
