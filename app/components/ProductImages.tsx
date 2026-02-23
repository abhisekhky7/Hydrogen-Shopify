import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Image, Video } from '@shopify/hydrogen';

export default function ProductImages({ media,selectedVariant }) {
  
  const [mainRef, mainApi] = useEmblaCarousel();
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
  }, [mainApi, onSelect]);
  useEffect(() => {
    if (!mainApi || !selectedVariant?.image) return;

    // Find the index of the variant's image within the media array
    const variantImageIndex = media.findIndex(
      (item) => item.image?.url === selectedVariant.image.url
    );

    if (variantImageIndex !== -1) {
      mainApi.scrollTo(variantImageIndex);
    }
  }, [mainApi, selectedVariant, media]);

  const onThumbClick = useCallback((index) => {
    if (!mainApi || !thumbApi) return;
    mainApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  return (
    <div className="product-media-container w-full">
      {/* MAIN VIEWPORT */}
      <div className="overflow-hidden bg-white rounded-lg" ref={mainRef}>
        <div className="flex gap-4 md:gap-8">
          {media.map((item, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={item.id || index}>
              {item.mediaContentType === 'IMAGE' && item.image && (
                <Image data={item.image} className="w-full h-auto object-cover" sizes="1000px" />
              )}

              {(item.mediaContentType === 'VIDEO' || item.mediaContentType === 'EXTERNAL_VIDEO') && (
                <div className="aspect-square flex items-center bg-black">
                  <Video
                    data={item}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-auto max-h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* THUMBNAILS VIEWPORT */}
      <div className="mt-4 overflow-hidden" ref={thumbRef}>
        <div className="flex gap-3">
          {media.map((item, index) => {
            // Get the preview image regardless of media type
            const image = item.image || item.previewImage;
            const isVideo = item.mediaContentType === 'VIDEO' || item.mediaContentType === 'EXTERNAL_VIDEO';

            return (
              <button
                key={`thumb-${item.id || index}`}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_20%] min-w-0 aspect-square border-2 rounded-md overflow-hidden transition-all ${
                  index === selectedIndex ? 'border-black' : 'border-transparent opacity-60'
                }`}
              >
                {image && (
                  <Image 
                    data={image} 
                    aspectRatio="1/1" 
                    sizes="100px" 
                    className="w-full h-full object-cover" 
                  />
                )}
                
                {/* Optional: Video Indicator */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <PlayIcon className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simple Play Icon SVG
function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}