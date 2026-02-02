import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { ProductProvider } from './contexts/ProductContext';

console.log('App starting...');
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ProductProvider>
        <App />
      </ProductProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
);
