import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { AppWrapper } from "./app/wrapper";

// Root component that wraps the Next.js App Router page for single-spa
const Root = (props: any) => {
  return <AppWrapper {...props} />;
};

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h2>Something went wrong in the microfrontend</h2>
        <details>
          <summary>Error details</summary>
          <pre>{err?.message}</pre>
        </details>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
