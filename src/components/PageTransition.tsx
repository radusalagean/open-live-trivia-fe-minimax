import { motion, type MotionProps } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface PageTransitionProps extends MotionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

const pageTransition = {
  duration: 0.2,
  ease: 'easeOut' as const,
};

export function PageTransition({ children, ...props }: PageTransitionProps) {
  const location = useLocation();

  const key = useMemo(() => location.pathname, [location.pathname]);

  return (
    <motion.div
      key={key}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
