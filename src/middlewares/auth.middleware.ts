import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido");
}

export const generateToken = (user: any): string => {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15d";

  // uso do "as string" ou "!" para convencer o TS que não é undefined
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // tipando o resultado como JwtPayload para usar depois
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
};
