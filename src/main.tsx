import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './components/LandingPage'
import { WidgetProvider } from './contexts/WidgetContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WidgetProvider>
      <LandingPage />
    </WidgetProvider>
  </React.StrictMode>
)
