import { Editor } from 'src/pages/Editor';
import 'src/App.less';
import { getTrl } from "src/lang/trls";

function App() {
  return (
    <div className='logo-and-editor'>
      <div>
        <div className="logo">{getTrl('appTitle')}</div>
      </div>
      <Editor />
    </div>
  )
}

export default App
