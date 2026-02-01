import { useRef, useCallback, MouseEventHandler, useState, type FC } from 'react';
import { Drop } from 'src/components/Drop';
import { Input } from 'src/components/Input';
import { Checkbox as CheckboxIcon } from 'src/components/Icon/Checkbox';
import { VolumeUp } from 'src/components/Icon/VolumeUp';
import { Fill } from 'src/components/Icon/Fill';
import { Strench } from 'src/components/Icon/Strench';
import { Typography } from 'src/components/Typography';
import { Selection } from 'src/components/Selection';
import { Chip } from 'src/components/Chip';
import { useTestSpeech } from 'src/api/useTestSpeech';
import { useReplaceAudio } from 'src/api/useReplaceAudio';
import { getUrl } from 'src/api/utils';
import { getTrl } from 'src/lang/trls';
import { useAppStore, Meme, ParticallPhrase, PhraseMode } from 'src/store';
import {
  Position,
  Boundary,
  useInputFocus,
  useSelectionLayerMetric,
  cancelEvent,
  findBoundaryPhrases,
  clamp,
  getPhraseDurationBasedOnSelection,
} from 'src/components/Timeline/components/Waveform/utils';
import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  meme: Meme;
}

const MIN_SELECTION = 25;
const ICON_HEIGHT = 17;
const ICON_OFFSET = 2;

export const Waveform: FC<WaveformProps> = ({ meme }) => {
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
  const replaceAudioRequest = useReplaceAudio();
  const [mode, setMode] = useState<PhraseMode>('fill');

  const handleChangeMode = useCallback((move: PhraseMode) => setMode(move), []);

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

  const sendReplaceAudioRequest = (phrasesForRequest: ParticallPhrase[]) => {
    // enable loader
    dispatch({ type: 'meme-loaded/set', payload: false });

    // send request
    const input = {
      inputVideo: meme.link,
      inputAudio: meme.audio,
      phrases: JSON.stringify(phrasesForRequest),
    };
    replaceAudioRequest(input, (result) => {
      dispatch({ type: 'meme/update', payload: result });
    });
  };

  const savePhrase = () => {
    if (!selectionRef.current || !selectionLayerRef.current) {
      return;
    }
    if (!textSpeech) {
      return;
    }

    // save currect phrase
    const { phraseStart, phraseDuration, selectionLeft, selectionRectWidth } =
      getPhraseDurationBasedOnSelection(selectionLayerRef, selectionRef, meme);
    dispatch({
      type: 'phrase/add',
      payload: {
        start: phraseStart,
        duration: phraseDuration,
        link: phraseLink,
        label: textSpeech,
        left: selectionLeft,
        width: selectionRectWidth,
        right: selectionLeft + selectionRectWidth,
        mode,
      },
    });
    clearSelection();

    // replace audio and reload video
    const phrasesForRequest = [
      ...phrases.map(({ label, start, mode, duration }) => ({ label, start, mode, duration })),
      {
        label: textSpeech,
        start: phraseStart,
        mode,
        duration: phraseDuration,
      },
    ];
    sendReplaceAudioRequest(phrasesForRequest);
  };

  const deleteSelection = (deletedIndex: number) => {
    dispatch({
      type: 'phrase/delete',
      payload: deletedIndex,
    });

    // replace audio and reload video
    const phrasesForRequest = phrases
      .filter((_, index) => index !== deletedIndex)
      .map(({ label, start, mode, duration }) => ({ label, start, mode, duration }));
    sendReplaceAudioRequest(phrasesForRequest);
  };

  const testSpeech = () => {
    if (!textSpeech) {
      return;
    }
    const phraseDurationInfo = getPhraseDurationBasedOnSelection(
      selectionLayerRef,
      selectionRef,
      meme
    );
    testSpeechRequest(textSpeech, mode, phraseDurationInfo.phraseDuration, (link) => {
      setPhraseLink(link);
      const audio = new Audio(getUrl(link));
      audio.play();
    });
  };

  useInputFocus(inputRef, showControls);

  useSelectionLayerMetric(imgRef, selectionLayerRef);

  return (
    <div className="waveform" onClick={cancelEvent}>
      <img ref={imgRef} src={meme.waveform} alt="Waveform" />
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
        <Drop show={showControls} activator={selectionRef} style={{ minWidth: 150 }}>
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
            <div className="waveform-phrase-bottom-actions">
              <Chip
                name="mode"
                checked={mode === 'fill'}
                onChange={() => handleChangeMode('fill')}
                wrapperProps={{ style: { height: ICON_HEIGHT + ICON_OFFSET } }}
              >
                <Fill style={{ height: ICON_HEIGHT }} />
              </Chip>
              <Chip
                name="mode"
                checked={mode === 'stretch'}
                onChange={() => handleChangeMode('stretch')}
                wrapperProps={{ style: { height: ICON_HEIGHT + ICON_OFFSET } }}
              >
                <Strench style={{ height: ICON_HEIGHT }} />
              </Chip>
              <div className="waveform-phrase-right-actions">
                <span className="waveform-phrase-right-action" onClick={testSpeech}>
                  <VolumeUp />
                </span>
                <span className="waveform-phrase-right-action" onClick={savePhrase}>
                  <CheckboxIcon />
                </span>
              </div>
            </div>
          </div>
        </Drop>
      </Selection>
    </div>
  );
};
