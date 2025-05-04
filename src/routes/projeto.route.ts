import { Router } from "express";
import { ProjetoController } from "../controllers/Projeto.Controller";

export function projetoRoutes(controller: ProjetoController): Router {
  const router = Router();

  router.post("/save", (req, res, next) => {
    controller.salvar(req, res);
  });
  router.get("/listar", (req, res, next) => {
    controller.listar(req, res);
  });

  return router;
}
