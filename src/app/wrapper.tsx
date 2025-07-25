'use client';

import React from 'react';
// import { createRoot } from 'react-dom/client';
import RootPage from './page';

// Wrapper component that can receive props from single-spa
interface AppWrapperProps {
  [key: string]: any;
}

export default function AppWrapper(props: AppWrapperProps = {}) {
  return <RootPage {...props} />;
}

// Export for use with single-spa
export { AppWrapper };
