import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

import { VideoFile } from "src/components/Icon/VideoFile";
import { Error } from "src/components/Icon/Error";
import { Button } from "src/components/Button";
import { Loader } from "src/components/Loader";
import { fetcher } from "src/api/fetcher";
import { getTrl } from "src/lang/trls";

import 'src/components/Upload/upload.less';

const sizeMB = (size: number) => (size / (1024 * 1024)).toFixed(2);

const IMAGE_ACCEPT = {
  'video/mp4': ['.mp4'],
};

interface UploadedFile {
  file: File;
  loading: boolean;
}

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>();
  const [error, setError] = useState('');
  const fileSize = uploadedFile?.file.size || 0;

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length === 1) {
      const rejectedFile = fileRejections[0];
      setUploadedFile({ file: rejectedFile.file, loading: false })
      setError(rejectedFile.errors[0].message);
    }
  }, []);

  const onDropAccepted = useCallback(async (files: File[]) => {
    if (files.length === 1) {
      const file = files[0];
      setUploadedFile({ file, loading: true })
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetcher.post('/api/v1/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: IMAGE_ACCEPT,
    onDropAccepted,
    onDropRejected,
    multiple: false,
  });

  return (
    <div className="upload-wrapper">
      <div className="upload" {...getRootProps()}>
        <div className="upload-background" />
        <input {...getInputProps()} />
        <div className="upload-icon">
          {error && <Error />}
          {!error && 
            <>
              {uploadedFile?.loading ? <Loader />  : <VideoFile />}
            </>
          }
        </div>
        <div className="upload-title">
          {error && getTrl('uploadFileRestriction')}
          {!error && <>{uploadedFile?.loading ? getTrl('uploadFileLoading') : getTrl('uploadTitle')}</>}
        </div>
        <div className="upload-description">
          {(error || uploadedFile) ? 
            getTrl('uploadFileSize', { size: sizeMB(fileSize) }) : 
            getTrl('uploadDescription')
          }
        </div>
        <div>
          {(error || uploadedFile) ? 
            <Button
              onClick={(event) => {
                setUploadedFile(undefined);
                setError('');
                event.stopPropagation();
              }}
            >
              {getTrl('uploadButtonCancel')}
            </Button> : 
            <Button onClick={() => null}>{getTrl('uploadButton')}</Button>
          }
        </div>
      </div>
      <div className="upload-alert">{getTrl('uploadAlert')}</div>
    </div>
    );
}

export { Upload };