import { useState } from 'react';
import { config } from '@/lib/config';

interface AvatarProps {
  userId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
};

const getBaseUrl = (apiUrl: string) => {
  return apiUrl.replace(/\/api$/, '');
};

export const Avatar = ({ userId, username, size = 'md', className = '' }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = `${getBaseUrl(config.apiUrl)}/public/user-thumbnails/${userId}.png`;

  if (imgError) {
    return (
      <div
        className={`${sizeClasses[size]} bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={`${username}'s avatar`}
      className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      onError={() => setImgError(true)}
    />
  );
};
