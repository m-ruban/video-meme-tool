import { useState, useCallback, type FC } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios from 'axios';

import { Button } from 'src/components/Button';
import { useToast, Toast } from 'src/components/Toast';
import { Typography } from 'src/components/Typography';
import { fetcher, ApiError } from 'src/api/fetcher';
import { getTrl } from 'src/lang/trls';

import 'src/components/Timeline/components/UploadImage/upload-image.less';

const IMAGE_ACCEPT = {
  'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
};

interface LoadFile {
  link: string;
}

export interface OnLoadFile {
  (props: LoadFile): void;
}

const UploadImage: FC<{ onLoadFile: OnLoadFile }> = ({ onLoadFile }) => {
  const { visibleToast, showToast } = useToast();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [error, setError] = useState('');

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length === 1) {
        const rejectedFile = fileRejections[0];
        setIsLoad(false);
        setError(rejectedFile.errors[0].message);
        showToast();
      }
    },
    [showToast]
  );

  const onDropAccepted = useCallback(
    async (files: File[]) => {
      if (files.length === 1) {
        const file = files[0];
        setIsLoad(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetcher.post<LoadFile>('/api/v1/video/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          onLoadFile(response.data);
        } catch (error: unknown) {
          if (axios.isAxiosError<ApiError>(error)) {
            const message = error.response?.data?.message;
            setError(Array.isArray(message) ? message.join(', ') : message || '');
            showToast();
          }
        } finally {
          setIsLoad(false);
        }
      }
    },
    [onLoadFile, showToast]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: IMAGE_ACCEPT,
    onDropAccepted,
    onDropRejected,
    multiple: false,
  });

  let buttonLabel = getTrl('selectImage');
  if (!error && isLoad) {
    buttonLabel = getTrl('loadImage');
  }

  return (
    <>
      <div {...getRootProps()} className="upload-image-wrapper">
        <input {...getInputProps()} />
        <Button classname="upload-image" stretched onClick={() => null}>
          {buttonLabel}
        </Button>
      </div>
      {visibleToast && (
        <Toast>
          <Typography mode="secondary">{getTrl('errorImage', { error })}</Typography>
        </Toast>
      )}
    </>
  );
};

export { UploadImage };
