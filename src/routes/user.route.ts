import { Router } from "express";
import User from "../models/user.model";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export function userRoutes(controller: UserController) {
  const router = Router();

  router.post("/CriarUsuario", (req, res, next) => {
    controller.create(req, res).catch(next);
  });
  router.get("/ListarUsuarios", authMiddleware, (req, res, next) => {
    controller.getAll(req, res).catch(next);
  });
  router.get("/BuscarUsuario/:id", (req, res, next) => {
    controller.getById(req, res).catch(next);
  });
  router.put("/AtualizarUsuario/:id", (req, res, next) => {
    controller.update(req, res).catch(next);
  });
  router.delete("/DeletarUsuario/:id", (req, res, next) => {
    controller.delete(req, res).catch(next);
  });
  router.post("/Login", (req, res, next) => {
    controller.login(req, res).catch(next);
  });

  return router;
}
