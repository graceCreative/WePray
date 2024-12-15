import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ width: '100%', height: '100%' }}>
    <App />
    </div>
    
  </StrictMode>,
)
