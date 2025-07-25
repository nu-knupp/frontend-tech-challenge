import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppWrapper } from './app/wrapper';

// This is for standalone development of the microfrontend
const StandaloneApp = () => {
  return <AppWrapper name="mf-main (standalone)" />;
};

// Mount the app when running in standalone mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<StandaloneApp />);
  }
}

export default StandaloneApp;
