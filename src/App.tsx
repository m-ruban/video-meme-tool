import { FileForm } from 'src/pages/FileForm';
import { Editor } from 'src/pages/Editor';
import { getTrl } from 'src/lang/trls';
import { useAppStore } from 'src/store';

import 'src/App.less';

function App() {
  const step = useAppStore((store) => store.state.step);
  return (
    <div className="logo-and-editor">
      <div>
        <div className="logo">{getTrl('appTitle')}</div>
      </div>
      {step === 'load-file' && <FileForm />}
      {step === 'edit-file' && <Editor />}
    </div>
  );
}

export default App;
