import { useRef, useCallback, MouseEventHandler, useState } from 'react';
import { Drop } from 'src/components/Drop';
import { Input } from 'src/components/Input';
import { Checkbox } from 'src/components/Icon/Checkbox';
import { VolumeUp } from 'src/components/Icon/VolumeUp';
import { Typography } from 'src/components/Typography';
import { Selection } from 'src/components/Selection';
import { useTestSpeech } from 'src/api/useTestSpeech';
import { getUrl } from 'src/api/utils';
import { getTrl } from 'src/lang/trls';
import { useAppStore } from 'src/store';
import {
  Position,
  Boundary,
  useInputFocus,
  useSelectionLayerMetric,
  cancelEvent,
  findBoundaryPhrases,
  clamp,
} from 'src/components/Timeline/components/Waveform/utils';
import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  path: string;
  duration: number;
}

const MIN_SELECTION = 25;

export const Waveform = ({ path, duration }: WaveformProps) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const phrases = useAppStore(({ state }) => state.phrases);
  const [showControls, setShowControls] = useState(false);
  const [textSpeech, setTextSpeech] = useState('');
  const [phraseLink, setPhraseLink] = useState('');
  const selectionLayerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<Position | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const boundaryRef = useRef<Boundary>({});
  const testSpeechRequest = useTestSpeech();

  const clearSelection = useCallback(() => {
    if (!selectionRef.current) {
      return;
    }
    selectionRef.current.style.left = `0px`;
    selectionRef.current.style.width = `0px`;
    setShowControls(false);
  }, []);

  const deleteSelection = useCallback(
    (index: number) => {
      dispatch({
        type: 'phrase/delete',
        payload: index,
      });
    },
    [dispatch]
  );

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!startPosRef.current || !imgRef.current || !selectionRef.current) {
      return;
    }

    const { left: leftBoundary, right: rightBoundary } = boundaryRef.current;
    const startPos = startPosRef.current;
    const rect = imgRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const leftBoundaryValue = leftBoundary?.right ?? Number.NEGATIVE_INFINITY;
    const rightBoundaryValue = rightBoundary?.left ?? Number.POSITIVE_INFINITY;

    const anchor = clamp(startPos.x, leftBoundaryValue, rightBoundaryValue);
    const cursor = clamp(currentX, leftBoundaryValue, rightBoundaryValue);
    const left = Math.min(anchor, cursor);
    const right = Math.max(anchor, cursor);

    selectionRef.current.style.left = `${left}px`;
    selectionRef.current.style.width = `${Math.max(0, right - left)}px`;
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
    setTextSpeech('');
    setPhraseLink('');
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
      // сохраним ближайшие границы
      boundaryRef.current = findBoundaryPhrases(phrases, startX);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      setShowControls(false);
    },
    [handleMouseMove, handleMouseUp, phrases]
  );

  const savePhrase = () => {
    if (!selectionRef.current || !selectionLayerRef.current) {
      return;
    }
    const selectionLayerRect = selectionLayerRef.current.getBoundingClientRect();
    const selectionRect = selectionRef.current.getBoundingClientRect();
    const selectionWidth = selectionRect.right - selectionRect.left;
    const selectionLeft = selectionRect.left - selectionLayerRect.left;
    const phraseStart = duration * (selectionLeft / selectionLayerRect.width);
    const phraseDuration = duration * (selectionWidth / selectionLayerRect.width);
    dispatch({
      type: 'phrase/add',
      payload: {
        start: phraseStart,
        duration: phraseDuration,
        link: phraseLink,
        label: textSpeech,
        left: selectionLeft,
        width: selectionRect.width,
        right: selectionLeft + selectionRect.width,
      },
    });
    clearSelection();
  };

  const testSpeech = () => {
    if (!textSpeech) {
      return;
    }
    testSpeechRequest(textSpeech, (link) => {
      setPhraseLink(link);
      const audio = new Audio(getUrl(link));
      audio.play();
    });
  };

  useInputFocus(inputRef, showControls);

  useSelectionLayerMetric(imgRef, selectionLayerRef);

  return (
    <div className="waveform" onClick={cancelEvent}>
      <img ref={imgRef} src={path} alt="Waveform" />
      <div
        ref={selectionLayerRef}
        className="waveform-selection-layer"
        onMouseDown={handleMouseDown}
      />
      {phrases.map(({ label, left, width }, index) => {
        return (
          <Selection
            key={`${label}-${left}-${width}`}
            left={left}
            width={width}
            onDelete={() => deleteSelection(index)}
            isSaved
          >
            <Typography mode="secondary" weight="bold" singleLine>
              {label}
            </Typography>
          </Selection>
        );
      })}
      <Selection ref={selectionRef} onDelete={clearSelection}>
        {showControls && (
          <Drop show={showControls} activator={selectionRef}>
            <div className="waveform-phrase">
              <Input
                ref={inputRef}
                name="phrase"
                placeholder={getTrl('phraseAdvice') as string}
                value={textSpeech}
                onChange={(event) => {
                  setTextSpeech(event.target.value);
                }}
                onKeyDown={(event) => event.key === 'Enter' && savePhrase()}
                autoComplete="off"
              />
              <div className="waveform-phrase-actions">
                <span className="waveform-phrase-action" onClick={testSpeech}>
                  <VolumeUp />
                </span>
                <span className="waveform-phrase-action" onClick={savePhrase}>
                  <Checkbox />
                </span>
              </div>
            </div>
          </Drop>
        )}
      </Selection>
    </div>
  );
};
