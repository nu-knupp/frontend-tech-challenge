'use client';

import React from 'react';
// import { createRoot } from 'react-dom/client';
import RootPage from './page';
import ThemeRegistry from '@/components/ThemeRegistry';

// Wrapper component that can receive props from single-spa
interface AppWrapperProps {
  [key: string]: any;
}

export default function AppWrapper(props: AppWrapperProps = {}) {
  return (
    <ThemeRegistry>
      <RootPage {...props} />
    </ThemeRegistry>
  );
}

// Export for use with single-spa
export { AppWrapper };
