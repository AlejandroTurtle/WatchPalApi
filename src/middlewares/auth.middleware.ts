import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido");
}

export const generateToken = (user: any): string => {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15d";

  // use any cast to avoid overload ambiguity in TypeScript declarations
  return (jwt.sign as any)({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // use any cast to avoid overload ambiguity and then assert JwtPayload
    const decoded = (jwt.verify as any)(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
};
