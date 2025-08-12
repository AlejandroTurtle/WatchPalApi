import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import UserController from "./controllers/user.controller";
import UserService from "./services/user.service";
import { userRoutes } from "./routes/user.route";
import ngrok from "@ngrok/ngrok";
import { ProjetoController } from "./controllers/Projeto.Controller";
import { InMemoryProjetoRepository } from "./repository/InMemoryProjetoRepository";
import { projetoRoutes } from "./routes/projeto.route";
import { PrismaUserRepository } from "./repository/prisma.User.Repository";
import { PrismaPasswordResetRepository } from "./repository/prismaPasswordResetRepository";
import mediaRoutes from "./routes/media.routes";

async function bootstrap(): Promise<void> {
  // const repo = new InMemoryUserRepository();
  const repo = new PrismaUserRepository();
  const resetRepo = new PrismaPasswordResetRepository();
  const service = new UserService(repo, resetRepo);
  const controller = new UserController(service);

  const projetoRepo = new InMemoryProjetoRepository();
  const projetoController = new ProjetoController(projetoRepo);

  const app: Application = express();
  const PORT = process.env.PORT || 3000;

  app.use(bodyParser.json());

  app.use("/usuarios", userRoutes(controller));
  app.use("/projetos", projetoRoutes(projetoController));
  app.use("/media", mediaRoutes);

  app.use(errorHandler);

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
  });

  function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erro interno no servidor",
    });
  }

  app.listen(PORT, async () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);

    const listener = await ngrok.connect({
      addr: PORT,
      authtoken_from_env: true,
    });

    const url = listener.url();
    console.log(`🔗 Ingress established at: ${url}`);

    try {
      const response = await fetch("http://localhost:3000/projetos/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      const result = await response.json();
      console.log("✅ URL enviada ao endpoint /projetos:", result);
    } catch (err) {
      console.error("❌ Erro ao enviar URL ao /projetos:", err);
    }
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
