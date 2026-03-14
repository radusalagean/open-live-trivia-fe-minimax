export const formatDate = (dateString: string, relativeTime: boolean): string => {
  if (relativeTime) {
    return formatRelativeTime(dateString);
  }
  const date = new Date(dateString);
  const stringDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const stringTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${stringDate} ${stringTime}`;
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return 'Invalid time';
  if (diffMs < 1000) return 'Just now';
  
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'A few seconds ago';
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const stringDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const stringTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${stringDate} ${stringTime}`;
};
