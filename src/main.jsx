import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WalletProvider } from './components/WalletContext.jsx'
import { ToastProvider } from './components/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
    <WalletProvider>
      
        <App />
     
    </WalletProvider>
     </ToastProvider>
  </StrictMode>,
)
