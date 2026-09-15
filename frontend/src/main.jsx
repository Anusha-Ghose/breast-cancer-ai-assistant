import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AssistantProvider } from './context/AssistantContext.jsx'
import { TrendsProvider } from './context/TrendsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AssistantProvider>
            <TrendsProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </TrendsProvider>
          </AssistantProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
