import { FC, RefObject, useCallback, useState, useEffect } from 'react';
import { Typography } from 'src/components/Typography';
import { getTrl } from 'src/lang/trls';
import { Drop } from 'src/components/Drop';
import { useAppStore, Meme } from 'src/store';
import {
  Selection,
  useSelection,
  Boundary,
  cancelEvent,
  getMetricBasedOnSelection,
} from 'src/components/Selection';
import { UploadImage, OnLoadFile } from 'src/components/Timeline/components/UploadImage';
import {
  useSelectionLayerMetric,
  addPeriod,
} from 'src/components/Timeline/components/Overlays/utils';
import { useReplaceAudio } from 'src/api/useReplaceAudio';

import 'src/components/Timeline/components/Overlays/overlays.less';

interface OverlaysProps {
  rulerRef: RefObject<HTMLDivElement | null>;
  meme: Meme;
}

export const Overlays: FC<OverlaysProps> = ({ rulerRef, meme }) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const playerInstance = useAppStore((store) => store.state.playerInstance);
  const previewFromStore = useAppStore((store) => store.state.preview);
  const [showControls, setShowControls] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [preview, setPreview] = useState<null | string>(null);
  const overlays = useAppStore((store) => store.state.overlays);
  const phrases = useAppStore((store) => store.state.phrases);
  const replaceAudioRequest = useReplaceAudio();

  const onSelectionStart = useCallback(() => {
    setShowControls(false);
    setShowDrop(false);
    setPreview('');
  }, []);

  const onSelectionEnd = useCallback(() => {
    setShowControls(true);
    setShowDrop(true);
  }, []);

  // findBoundaryPhrases use dummy values
  const findBoundary = useCallback(
    () => ({ left: 0, right: Number.MAX_SAFE_INTEGER }) as unknown as Boundary,
    []
  );

  const { selectionLayerRef, selectionRef, handleMouseDown, clear } = useSelection(
    onSelectionStart,
    onSelectionEnd,
    findBoundary
  );

  const clearSelection = useCallback(
    (clearStore = true) => {
      if (clearStore) {
        dispatch({ type: 'preview/delete' });
      }
      clear();
      setShowControls(false);
      setShowDrop(false);
      setPreview('');
    },
    [clear, dispatch]
  );

  const addOverlay = useCallback<OnLoadFile>(
    ({ link }) => {
      if (!playerInstance) {
        return;
      }
      const { start, duration, left, width } = getMetricBasedOnSelection(
        selectionLayerRef,
        selectionRef,
        meme
      );
      dispatch({
        type: 'preview/add',
        payload: {
          inputImage: link,
          start: start,
          end: start + duration,
          x1: 0,
          y1: 0,
          x2: 70,
          y2: 100,
          left,
          width,
        },
      });
      setShowDrop(false);
      setPreview(link);

      // move on 100 мс for showing img
      const { seconds: movedSeconds, percent: movedPercent } = addPeriod(start, meme);
      dispatch({
        type: 'played/set',
        payload: { percent: movedPercent, seconds: movedSeconds },
      });
      playerInstance.seekTo(movedSeconds, 'seconds');
    },
    [dispatch, meme, selectionLayerRef, selectionRef, playerInstance]
  );

  useSelectionLayerMetric(rulerRef, selectionLayerRef);

  // can be deleted from player
  useEffect(() => {
    if (previewFromStore === null) {
      clearSelection(false);
    }
  }, [previewFromStore, clearSelection]);

  const deleteSelection = (deletedIndex: number) => {
    dispatch({ type: 'overlay/delete', payload: deletedIndex });
    const overlaysForRequest = overlays.filter((_, index) => index !== deletedIndex);

    dispatch({ type: 'meme-loaded/set', payload: false });

    if (!meme.originalLink) {
      return;
    }

    // send request
    const input = {
      inputVideo: meme.originalLink,
      inputAudio: meme.audio || '',
      phrases: JSON.stringify(phrases),
      overlays: JSON.stringify(overlaysForRequest),
    };

    replaceAudioRequest(input, (result) => {
      dispatch({ type: 'meme/update', payload: result });
    });
  };

  return (
    <div className="overlay-wrapper" onClick={cancelEvent}>
      <div className="overlay" ref={selectionLayerRef} onMouseDown={handleMouseDown}>
        <div className="overlay-tip">
          <Typography mode="primary">{getTrl('overlayTip')}</Typography>
        </div>
      </div>
      {overlays.map(({ inputImage, left, width }, index) => {
        return (
          <Selection
            key={`${inputImage}-${left}-${width}`}
            left={left}
            width={width}
            onDelete={() => deleteSelection(index)}
            isSaved
            showClose
          >
            <img src={inputImage} alt="preview" className="overlay-preview" />
          </Selection>
        );
      })}
      <Selection ref={selectionRef} onDelete={clearSelection} showClose={showControls}>
        <Drop activator={selectionRef} style={{ minWidth: 150 }} show={showDrop}>
          <UploadImage onLoadFile={addOverlay} />
        </Drop>
        {preview && <img src={preview} alt="preview" className="overlay-preview" />}
      </Selection>
    </div>
  );
};
