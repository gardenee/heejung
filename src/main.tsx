import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MetadataProvider } from './contexts/metadata-context/metadata-context-provider.tsx';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MetadataProvider>
        <App />
      </MetadataProvider>
    </QueryClientProvider>
  </StrictMode>,
);
