import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const isNginxProxy = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  
  const expiredCookie = serialize("session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: isNginxProxy ? 'lax' : (isProd ? 'none' : 'lax'),
    secure: !isNginxProxy && isProd,
  });

  res.setHeader("Set-Cookie", expiredCookie);
  res.status(200).json({ message: "Logout realizado com sucesso" });
}
