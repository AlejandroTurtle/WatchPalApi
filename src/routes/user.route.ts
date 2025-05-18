import { Router } from "express";
import User from "../models/user.model";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSinglePhoto } from "../config/multer";

export function userRoutes(controller: UserController) {
  const router = Router();

  router.post("/CriarUsuario", uploadSinglePhoto, (req, res, next) =>
    controller.create(req, res).catch(next)
  );
  router.get("/ListarUsuarios", (req, res, next) => {
    controller.getAll(req, res).catch(next);
  });
  router.get("/BuscarUsuario/:id", authMiddleware, (req, res, next) => {
    controller.getById(req, res).catch(next);
  });
  router.put("/AtualizarUsuario/:id", uploadSinglePhoto, (req, res, next) => {
    controller.update(req, res).catch(next);
  });
  router.delete("/DeletarUsuario/:id", (req, res, next) => {
    controller.delete(req, res).catch(next);
  });
  router.post("/Login", (req, res, next) => {
    controller.login(req, res).catch(next);
  });
  router.post("/DeletarTodosUsuarios", (req, res, next) => {
    controller.deleteAllUsers(req, res).catch(next);
  });
  router.post("/EmailRecuperarSenha", (req, res, next) => {
    controller.sendEmailRecoverPassword(req, res).catch(next);
  });

  router.post("/RecuperarSenha", (req, res, next) => {
    controller.recoverPassword(req, res).catch(next);
  });

  router.post("/ReenviarCodigo", (req, res, next) => {
    controller.resendCode(req, res).catch(next);
  });

  router.post("/ValidarToken", (req, res, next) => {
    controller.validadeToken(req, res).catch(next);
  });

  router.get("/UsuariosDados", authMiddleware, (req, res, next) => {
    controller.userData(req, res).catch(next);
  });
  return router;
}
