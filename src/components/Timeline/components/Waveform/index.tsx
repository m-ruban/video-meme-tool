import { useRef, useCallback, MouseEventHandler, useEffect, useState } from 'react';
import { SmallCross } from 'src/components/Icon/SmallCross';
import { Drop } from 'src/components/Drop';
import { Input } from 'src/components/Input';
import { Checkbox } from 'src/components/Icon/Checkbox';
import { VolumeUp } from 'src/components/Icon/VolumeUp';
import { getTrl } from 'src/lang/trls';
import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  path: string;
}

interface Position {
  x: number;
  y: number;
}

const MIN_SELECTION = 25;
const cancelEvent: MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

export const Waveform = ({ path }: WaveformProps) => {
  const [showControls, setShowControls] = useState(false);
  const selectionLayerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<Position | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const clearSelection = useCallback(() => {
    if (!selectionRef.current) {
      return;
    }
    selectionRef.current.style.left = `0px`;
    selectionRef.current.style.width = `0px`;
    setShowControls(false);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!startPosRef.current || !imgRef.current || !selectionRef.current) {
      return;
    }
    const startPos = startPosRef.current;
    const rect = imgRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const x = Math.min(currentX, startPos.x);
    const width = Math.abs(currentX - startPos.x);
    selectionRef.current.style.left = `${x}px`;
    selectionRef.current.style.width = `${width}px`;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!selectionRef.current) {
      return;
    }
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    const rect = selectionRef.current.getBoundingClientRect();
    startPosRef.current = null;
    if (rect.width < MIN_SELECTION) {
      clearSelection();
      return;
    }
    setShowControls(true);
  }, [handleMouseMove, clearSelection]);

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (!imgRef.current || !selectionRef.current) {
        return;
      }
      event.stopPropagation();
      const rect = imgRef.current.getBoundingClientRect();
      const startX = event.clientX - rect.left;
      const startY = event.clientY - rect.top;
      startPosRef.current = { x: startX, y: startY };
      selectionRef.current.style.left = `${startX}px`;
      selectionRef.current.style.width = `0px`;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      setShowControls(false);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    if (!imgRef.current || !selectionLayerRef.current) {
      return;
    }
    const updateBarWidth = () => {
      if (!imgRef.current || !selectionLayerRef.current) {
        return;
      }
      selectionLayerRef.current.style.width = imgRef.current.scrollWidth + 'px';
    };
    const resizeObserver = new ResizeObserver(updateBarWidth);
    resizeObserver.observe(imgRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="waveform" onClick={cancelEvent}>
      <img ref={imgRef} src={path} alt="Waveform" />
      <div
        ref={selectionLayerRef}
        className="waveform-selection-layer"
        onMouseDown={handleMouseDown}
      />
      <div
        ref={selectionRef}
        className="waveform-selection-box"
        onClick={cancelEvent}
        onMouseDown={cancelEvent}
      >
        {showControls && (
          <>
            <Drop show={showControls} activator={selectionRef}>
              <div className="waveform-phrase">
                <Input name="phrase" placeholder={getTrl('phraseAdvice') as string} />
                <div className="waveform-phrase-actions">
                  <span className="waveform-phrase-action">
                    <VolumeUp />
                  </span>
                  <span className="waveform-phrase-action">
                    <Checkbox />
                  </span>
                </div>
              </div>
            </Drop>
            <span className="waveform-selection-clear" onClick={clearSelection}>
              <SmallCross />
            </span>
          </>
        )}
      </div>
    </div>
  );
};
