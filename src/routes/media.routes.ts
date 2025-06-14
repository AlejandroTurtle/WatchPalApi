import { Router } from "express";
import MediaController from "../controllers/media.controller";
import { PrismaMediaRepository } from "../repository/prismaMediaRepository";
import MediaService from "../services/media.service";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const repository = new PrismaMediaRepository();
const service = new MediaService(repository);
const controller = new MediaController(service);

// Rotas para Favoritos
router.post("/adicionar-favorito", authMiddleware, (req, res, next) => {
  controller.addFavorite(req, res).catch(next);
});

router.delete(
  "/remover-favorito/:tituloId",
  authMiddleware,
  (req, res, next) => {
    controller.removeFavorite(req, res).catch(next);
  }
);

router.get("/favoritos", authMiddleware, (req, res, next) => {
  controller.getUserFavorites(req, res).catch(next);
});

router.get("/favoritos/check/:tituloId", authMiddleware, (req, res, next) => {
  controller.checkFavorite(req, res).catch(next);
});

// Rotas para Séries Concluídas
router.post("/series/concluidas", authMiddleware, (req, res, next) => {
  controller.markSeriesAsCompleted(req, res).catch(next);
});

router.delete(
  "/series/concluidas/:tituloId",
  authMiddleware,
  (req, res, next) => {
    controller.unmarkSeriesAsCompleted(req, res).catch(next);
  }
);

router.get("/series/concluidas", authMiddleware, (req, res, next) => {
  controller.getUserCompletedSeries(req, res).catch(next);
});

router.get(
  "/series/concluidas/check/:tituloId",
  authMiddleware,
  (req, res, next) => {
    controller.checkSeriesCompleted(req, res).catch(next);
  }
);

// Rotas para Episódios Assistidos
router.post("/episodios/assistidos", authMiddleware, (req, res, next) => {
  controller.markEpisodeAsWatched(req, res).catch(next);
});

router.delete(
  "/episodios/assistidos/:tituloId/:season/:episode",
  authMiddleware,
  (req, res, next) => {
    controller.unmarkEpisodeAsWatched(req, res).catch(next);
  }
);

router.get("/episodios/assistidos", authMiddleware, (req, res, next) => {
  controller.getUserWatchedEpisodes(req, res).catch(next);
});

router.get(
  "/episodios/assistidos/check/:tituloId/:season/:episode",
  authMiddleware,
  (req, res, next) => {
    controller.checkEpisodeWatched(req, res).catch(next);
  }
);

export default router;
