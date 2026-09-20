'use client';

import React, { useState } from 'react';
import { transformMediaUrl, isVideoUrl, isYoutubeOrVimeo } from '@/lib/mediaUtils';

interface MediaViewProps {
  src?: string | null;
  alt?: string;
  className?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  showPlayIcon?: boolean;
}

export const MediaView: React.FC<MediaViewProps> = ({
  src,
  alt = 'KOUKOU Media',
  className = '',
  onClick,
  loading = 'lazy',
  showPlayIcon = false,
}) => {
  const transformed = transformMediaUrl(src);
  const isVideo = isVideoUrl(src);
  const isEmbed = isYoutubeOrVimeo(src);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder image if URL fails
  const fallbackImage = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80';

  if (!transformed) {
    return <img src={fallbackImage} alt={alt} className={className} />;
  }

  if (isEmbed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <iframe
          src={transformed}
          title={alt}
          className="w-full h-full border-0 pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
        <video
          src={transformed}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {showPlayIcon && (
          <div className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-[10px] pointer-events-none">
            ▶ Video
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={hasError ? fallbackImage : transformed}
      alt={alt}
      loading={loading}
      onClick={onClick}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
