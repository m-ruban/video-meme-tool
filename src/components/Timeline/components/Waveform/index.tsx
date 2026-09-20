import { useRef, useCallback, useState, type FC } from 'react';
import { Drop } from 'src/components/Drop';
import { Input } from 'src/components/Input';
import { Checkbox as CheckboxIcon } from 'src/components/Icon/Checkbox';
import { VolumeUp } from 'src/components/Icon/VolumeUp';
import { Fill } from 'src/components/Icon/Fill';
import { Strench } from 'src/components/Icon/Strench';
import { Typography } from 'src/components/Typography';
import {
  Selection,
  useSelection,
  cancelEvent,
  getMetricBasedOnSelection,
} from 'src/components/Selection';
import { Chip } from 'src/components/Chip';
import { useTestSpeech } from 'src/api/useTestSpeech';
import { useReplaceAudio } from 'src/api/useReplaceAudio';
import { getUrl } from 'src/api/utils';
import { getTrl } from 'src/lang/trls';
import { useAppStore, Meme, ParticallPhrase, PhraseMode } from 'src/store';
import {
  useInputFocus,
  findBoundaryPhrases,
  useSelectionLayerMetric,
} from 'src/components/Timeline/components/Waveform/utils';
import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  meme: Meme;
}

const ICON_HEIGHT = 17;
const ICON_OFFSET = 2;

export const Waveform: FC<WaveformProps> = ({ meme }) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const phrases = useAppStore(({ state }) => state.phrases);
  const [showControls, setShowControls] = useState(false);
  const [textSpeech, setTextSpeech] = useState('');
  const [phraseLink, setPhraseLink] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const baseImageLayerRef = useRef<HTMLImageElement>(null);
  const testSpeechRequest = useTestSpeech();
  const replaceAudioRequest = useReplaceAudio();
  const [mode, setMode] = useState<PhraseMode>('fill');
  const overlays = useAppStore(({ state }) => state.overlays);

  const handleChangeMode = useCallback((move: PhraseMode) => setMode(move), []);

  const onSelectionStart = useCallback(() => {
    setShowControls(false);
  }, []);

  const onSelectionEnd = useCallback(() => {
    setShowControls(true);
    setTextSpeech('');
    setPhraseLink('');
  }, []);

  const findBoundary = useCallback(
    (startX: number) => findBoundaryPhrases(startX, phrases),
    [phrases]
  );

  const { selectionLayerRef, selectionRef, handleMouseDown, clear } = useSelection(
    onSelectionStart,
    onSelectionEnd,
    findBoundary
  );

  const clearSelection = useCallback(() => {
    clear();
    setShowControls(false);
  }, [clear]);

  const sendReplaceAudioRequest = (phrasesForRequest: ParticallPhrase[]) => {
    // enable loader
    dispatch({ type: 'meme-loaded/set', payload: false });

    if (!meme.originalLink) {
      return;
    }

    // send request
    const input = {
      inputVideo: meme.originalLink,
      inputAudio: meme.audio,
      phrases: JSON.stringify(phrasesForRequest),
      overlays: JSON.stringify(overlays),
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
    const { start, duration, left, width } = getMetricBasedOnSelection(
      selectionLayerRef,
      selectionRef,
      meme
    );
    dispatch({
      type: 'phrase/add',
      payload: {
        start,
        duration,
        link: phraseLink,
        label: textSpeech,
        left,
        width,
        right: left + width,
        mode,
      },
    });
    clearSelection();

    // replace audio and reload video
    const phrasesForRequest = [
      ...phrases.map(({ label, start, mode, duration }) => ({ label, start, mode, duration })),
      {
        label: textSpeech,
        start,
        mode,
        duration,
      },
    ];
    sendReplaceAudioRequest(phrasesForRequest);
  };

  const deleteSelection = (deletedIndex: number) => {
    dispatch({ type: 'phrase/delete', payload: deletedIndex });

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
    const metrics = getMetricBasedOnSelection(selectionLayerRef, selectionRef, meme);
    testSpeechRequest(textSpeech, mode, metrics.duration, (link) => {
      setPhraseLink(link);
      const audio = new Audio(getUrl(link));
      audio.play();
    });
  };

  useInputFocus(inputRef, showControls);

  useSelectionLayerMetric(baseImageLayerRef, selectionLayerRef);

  return (
    <div className="waveform" onClick={cancelEvent}>
      <img ref={baseImageLayerRef} src={meme.waveform} alt="Waveform" />
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
            showClose
          >
            <Typography mode="secondary" weight="bold" singleLine>
              {label}
            </Typography>
          </Selection>
        );
      })}
      <Selection ref={selectionRef} onDelete={clearSelection} showClose={showControls}>
        <Drop activator={selectionRef} style={{ minWidth: 150 }} show={showControls}>
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
