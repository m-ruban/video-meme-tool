import { FileForm } from 'src/pages/FileForm';
import { Editor } from 'src/pages/Editor';
import { ViewFile } from 'src/pages/ViewFile';
import { getTrl } from 'src/lang/trls';
import { useAppStore } from 'src/store';

import 'src/App.less';

const isMemeViewPath = (pathname: string): boolean => {
  const memePathRegex = /^\/video\/\d{4}-\d{2}-\d{2}\/[A-Za-z0-9_-]+$/;
  return memePathRegex.test(pathname);
};

function App() {
  const step = useAppStore((store) => store.state.step);
  const isViewFile = isMemeViewPath(window.location.pathname);
  return (
    <div className="logo-and-editor">
      <div>
        <div className="logo">{getTrl('appTitle')}</div>
      </div>
      {isViewFile && <ViewFile />}
      {!isViewFile && step === 'load-file' && <FileForm />}
      {!isViewFile && step === 'edit-file' && <Editor />}
    </div>
  );
}

export default App;
