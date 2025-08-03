import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const expiredCookie = serialize("session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.setHeader("Set-Cookie", expiredCookie);
  res.status(200).json({ message: "Logout realizado com sucesso" });
}
