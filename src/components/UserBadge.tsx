import { Avatar } from '@/components/Avatar';
import type { User } from '@/types';

interface UserBadgeProps {
  user: User | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserBadge = ({ user, size = 'sm', className = '' }: UserBadgeProps) => {
  if (!user) return null;

  return (
    <div className={`flex items-center gap-2 text-gray-700 bg-light-grey px-3 py-1 rounded ${className}`}>
      <Avatar userId={user._id} username={user.username} size={size} />
      <span className={`font-medium truncate ${size === 'sm' ? 'max-w-[100px]' : size === 'md' ? 'max-w-[150px]' : 'max-w-[200px]'}`}>
        {user.username}
      </span>
    </div>
  );
};
