interface ArrowDownIconProps {
  className?: string;
}

export const ArrowDownIcon = ({ className = "w-6 h-6" }: ArrowDownIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M11,5v11.17l-4.88,-4.88c-0.39,-0.39 -1.03,-0.39 -1.42,0 -0.39,0.39 -0.39,1.02 0,1.41l6.59,6.59c0.39,0.39 1.02,0.39 1.41,0l6.59,-6.59c0.39,-0.39 0.39,-1.02 0,-1.41 -0.39,-0.39 -1.02,-0.39 -1.41,0L13,16.17V5c0,-0.55 -0.45,-1 -1,-1s-1,0.45 -1,1z" />
  </svg>
);
