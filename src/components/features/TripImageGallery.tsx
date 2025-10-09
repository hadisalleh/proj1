'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react';

interface TripImageGalleryProps {
  images: string[];
  title: string;
}

export default function TripImageGallery({ images, title }: TripImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-6xl">🎣</div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        {images.length === 1 ? (
          // Single image layout
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover cursor-pointer"
              onClick={() => openModal(0)}
              sizes="100vw"
              priority
            />
          </div>
        ) : (
          // Multiple images layout
          <div className="grid grid-cols-4 gap-2 h-96 md:h-[500px]">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative">
              <Image
                src={images[currentImageIndex]}
                alt={title}
                fill
                className="object-cover rounded-l-lg cursor-pointer"
                onClick={() => openModal(currentImageIndex)}
                sizes="50vw"
                priority
              />
            </div>

            {/* Smaller images */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className={`relative ${index === 3 ? 'rounded-tr-lg' : ''} ${
                  index >= 2 ? 'rounded-br-lg' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 2}`}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={() => openModal(index + 1)}
                  sizes="25vw"
                />
                {/* Show more overlay on last visible image */}
                {index === 3 && images.length > 5 && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer rounded-br-lg"
                    onClick={() => openModal(index + 1)}
                  >
                    <div className="text-white text-center">
                      <Grid3X3 className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-lg font-semibold">+{images.length - 5}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation arrows for main gallery */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* View all photos button */}
        <button
          onClick={() => openModal(0)}
          className="absolute bottom-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          View all photos
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-12 w-12" />
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-12 w-12" />
                </button>
              </>
            )}

            {/* Main image */}
            <div className="relative max-w-4xl max-h-full w-full h-full">
              <Image
                src={images[modalImageIndex]}
                alt={`${title} - Image ${modalImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
              {modalImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden ${
                      index === modalImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}