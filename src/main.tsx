import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/inter';
import {CssVarsProvider} from "@mui/joy";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider>
      <App/>
    </CssVarsProvider>
  </StrictMode>,
)
