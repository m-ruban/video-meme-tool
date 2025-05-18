import { useRef, useCallback, MouseEvent } from 'react';
import { motion } from 'framer-motion';

import 'src/components/ProgressBar/progress-bar.less';

type OnChange = (value: number) => void;

interface ProgressBarProps {
  value: number;
  onChange?: OnChange;
}

export const ProgressBar = ({ value, onChange }: ProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef<OnChange>(onChange);
  onChangeRef.current = onChange;

  const handleClick = useCallback((event: MouseEvent) => {
    if (!barRef.current || !onChangeRef.current) {
      return;
    }

    const rect = barRef.current.getBoundingClientRect();
    const newValue = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onChangeRef.current?.(newValue);
  }, []);

  return (
    <div className="progress-bar" ref={barRef} onClick={handleClick}>
      <motion.div
        className="progress-fill"
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};
