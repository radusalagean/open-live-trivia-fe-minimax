import { useState, useEffect, useRef } from 'react';

interface AnimatedCoinsProps {
  value: number;
  animated?: boolean;
  className?: string;
}

const ANIMATION_DELAY = 50;
const COIN_ACCELERATE_LONG = 2000;
const COIN_ACCELERATE_SHORT = 300;
const COIN_THRESHOLD = 10;

export function AnimatedCoins({ value, animated = false, className = '' }: AnimatedCoinsProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const oldValue = displayValueRef.current;
    const newValue = valueRef.current;

    if (!animated || oldValue === newValue) {
      setDisplayValue(newValue);
      return;
    }
    
    const diff = newValue - oldValue;
    const isLongAnimation = Math.abs(diff) > COIN_THRESHOLD;
    const duration = isLongAnimation ? COIN_ACCELERATE_LONG : COIN_ACCELERATE_SHORT;
    const steps = Math.max(1, Math.round(duration / ANIMATION_DELAY));
    const diffPerStep = diff / steps;
    
    let currentStep = 0;
    
    intervalRef.current = setInterval(() => {
      currentStep++;
      const nextValue = oldValue + (diffPerStep * currentStep);
      
      const isComplete = currentStep >= steps || 
                        (diffPerStep > 0 && nextValue >= newValue) ||
                        (diffPerStep < 0 && nextValue <= newValue);
      
      if (isComplete) {
        setDisplayValue(newValue);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setDisplayValue(nextValue);
      }
    }, ANIMATION_DELAY);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [value, animated]);

  return (
    <span 
      className={className}
      style={{ fontFamily: '"Share Tech Mono", monospace' }}
    >
      {displayValue.toFixed(2)}
    </span>
  );
}
