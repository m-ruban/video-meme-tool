import { useRef, useCallback, MouseEventHandler, useEffect, useState } from 'react';
import { SmallCross } from 'src/components/Icon/SmallCross';
import { Drop } from 'src/components/Drop';
import { Input } from 'src/components/Input';
import { Checkbox } from 'src/components/Icon/Checkbox';
import { VolumeUp } from 'src/components/Icon/VolumeUp';
import { Typography } from 'src/components/Typography';
import { useTestSpeech } from 'src/api/useTestSpeech';
import { getUrl } from 'src/api/utils';
import { getTrl } from 'src/lang/trls';
import { useAppStore, Phrase } from 'src/store';
import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  path: string;
  duration: number;
}

interface Position {
  x: number;
  y: number;
}

type Boundary = { left?: Phrase; right?: Phrase };

const MIN_SELECTION = 25;
const cancelEvent: MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

function findBoundaryPhrases(phrases: Phrase[], x: number): Boundary {
  let leftBoundary: Phrase | undefined;
  let rightBoundary: Phrase | undefined;
  for (const phrase of phrases) {
    // левая граница
    if (phrase.right < x) {
      if (!leftBoundary || phrase.right > leftBoundary.right) {
        leftBoundary = phrase;
      }
    }
    // правая граница
    if (phrase.left > x) {
      if (!rightBoundary || phrase.left < rightBoundary.left) {
        rightBoundary = phrase;
      }
    }
  }
  return { left: leftBoundary, right: rightBoundary };
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

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
      // сохраним границы
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

  useEffect(() => {
    if (!inputRef.current || !showControls) {
      return;
    }
    inputRef.current.focus();
  }, [showControls]);

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
          <div
            key={`${label}-${left}-${width}`}
            className="waveform-selection-box waveform-selection-box_saved"
            onClick={cancelEvent}
            onMouseDown={cancelEvent}
            style={{ left: left, width: `${width}px` }}
          >
            <Typography mode="secondary" weight="bold">
              {label}
            </Typography>
            <span className="waveform-selection-clear" onClick={() => deleteSelection(index)}>
              <SmallCross />
            </span>
          </div>
        );
      })}
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
                <Input
                  ref={inputRef}
                  name="phrase"
                  placeholder={getTrl('phraseAdvice') as string}
                  value={textSpeech}
                  onChange={(event) => {
                    setTextSpeech(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      savePhrase();
                    }
                  }}
                  autoComplete="off"
                />
                <div className="waveform-phrase-actions">
                  <span
                    className="waveform-phrase-action"
                    onClick={() => {
                      if (!textSpeech) {
                        return;
                      }
                      testSpeechRequest(textSpeech, (link) => {
                        setPhraseLink(link);
                        const audio = new Audio(getUrl(link));
                        audio.play();
                      });
                    }}
                  >
                    <VolumeUp />
                  </span>
                  <span className="waveform-phrase-action" onClick={savePhrase}>
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
