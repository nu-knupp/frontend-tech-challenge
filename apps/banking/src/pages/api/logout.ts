import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getSessionCookieName,
  getSessionSameSite,
  shouldUseSecureCookies,
} from "@banking/shared-utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const expiredSessionCookie = serialize(getSessionCookieName(), "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: getSessionSameSite(),
    secure: shouldUseSecureCookies(),
  });

  res.setHeader("Set-Cookie", expiredSessionCookie);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ message: "Logout realizado com sucesso" });
}
