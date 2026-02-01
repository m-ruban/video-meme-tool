import { useRef, useCallback, MouseEvent, type FC } from 'react';
import { motion } from 'framer-motion';

import 'src/components/ProgressBar/progress-bar.less';

type OnChange = (value: number) => void;

interface ProgressBarProps {
  value: number;
  onChange?: OnChange;
}

export const ProgressBar: FC<ProgressBarProps> = ({ value, onChange }) => {
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
      <div className="progress-fill-wrapper">
        <motion.div
          className="progress-fill"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
};
