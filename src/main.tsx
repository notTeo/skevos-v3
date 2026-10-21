import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import './styles/global.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { trackScreenHeight } from './lib/screenHeight'

trackScreenHeight()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
