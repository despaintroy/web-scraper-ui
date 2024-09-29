import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/inter';
import {CssVarsProvider} from "@mui/joy";
import {ScraperProvider} from "./utils/scraper/ScraperProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider>
      <ScraperProvider>
        <App/>
      </ScraperProvider>
    </CssVarsProvider>
  </StrictMode>,
)
