"use client";

import { ReactNode, useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { useServerInsertedHTML } from "next/navigation";

type Props = {
  children: ReactNode;
};

export function StyledComponentsRegistry({ children }: Props) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  return (
    <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
  );
}
