import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#d32f2f', background: '#fff3f3' }}>
        <h2>Ocorreu um erro inesperado no microfrontend Analytics</h2>
        <pre style={{ color: '#d32f2f', fontSize: 14 }}>{err?.toString()}</pre>
        <details style={{ marginTop: 16 }}>
          <summary>Detalhes</summary>
          <pre>{info?.componentStack}</pre>
        </details>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
