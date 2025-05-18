import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/App.tsx';

import 'src/styles/reset.less';
import 'src/styles/fonts.less';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
