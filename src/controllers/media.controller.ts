import { Request, Response } from "express";
import MediaService from "../services/media.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export default class MediaController {
  constructor(private service: MediaService) {}

  // Métodos para Favoritos
  async addFavorite(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { titulo, tituloId, numberEpisodes, numberSeasons, type } = req.body;
    if (!titulo || !tituloId) {
      return res.status(400).json({
        success: false,
        error: "Título e ID do título são obrigatórios",
      });
    }

    try {
      const favorite = await this.service.addFavorite({
        userId,
        titulo,
        tituloId,
        numberEpisodes,
        numberSeasons,
        type,
      });
      return res.json({
        success: true,
        data: {
          message: "Título adicionado aos favoritos com sucesso",
          favorite,
        },
      });
    } catch (error: any) {
      const msg =
        error.message === "Este título já está nos favoritos"
          ? "Este título já está nos favoritos"
          : "Erro ao adicionar favorito";
      const status =
        error.message === "Este título já está nos favoritos" ? 400 : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async removeFavorite(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId } = req.params;
    if (!tituloId) {
      return res
        .status(400)
        .json({ success: false, error: "ID do título é obrigatório" });
    }

    try {
      await this.service.removeFavorite(userId, parseInt(tituloId));
      return res.status(200).json({
        success: true,
        data: { message: "Favorito removido com sucesso" },
      });
    } catch (error: any) {
      const msg =
        error.message === "Favorito não encontrado"
          ? error.message
          : "Erro ao remover favorito";
      const status = error.message === "Favorito não encontrado" ? 404 : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async getUserFavorites(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    try {
      const favorites = await this.service.getUserFavorites(userId);
      return res.status(200).json({ success: true, data: favorites });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao buscar favoritos" });
    }
  }

  async checkFavorite(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId } = req.params;
    if (!tituloId) {
      return res
        .status(400)
        .json({ success: false, error: "ID do título é obrigatório" });
    }

    try {
      const isFavorite = await this.service.isFavorite(
        userId,
        parseInt(tituloId)
      );
      return res.status(200).json({ success: true, data: { isFavorite } });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao verificar favorito" });
    }
  }

  // Métodos para Séries Concluídas
  async markSeriesAsCompleted(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId } = req.body;
    if (!tituloId) {
      return res
        .status(400)
        .json({ success: false, error: "ID do título é obrigatório" });
    }

    try {
      const completedSeries = await this.service.markSeriesAsCompleted({
        userId,
        tituloId,
      });
      return res.status(201).json({ success: true, data: completedSeries });
    } catch (error: any) {
      const msg =
        error.message === "Esta série já está marcada como concluída"
          ? error.message
          : "Erro ao marcar série como concluída";
      const status =
        error.message === "Esta série já está marcada como concluída"
          ? 400
          : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async unmarkSeriesAsCompleted(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId } = req.params;
    if (!tituloId) {
      return res
        .status(400)
        .json({ success: false, error: "ID do título é obrigatório" });
    }

    try {
      await this.service.unmarkSeriesAsCompleted(userId, parseInt(tituloId));
      return res.status(200).json({
        success: true,
        data: { message: "Série desmarcada como concluída com sucesso" },
      });
    } catch (error: any) {
      const msg =
        error.message === "Série não encontrada nos concluídos"
          ? error.message
          : "Erro ao desmarcar série como concluída";
      const status =
        error.message === "Série não encontrada nos concluídos" ? 404 : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async getUserCompletedSeries(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    try {
      const completedSeries = await this.service.getUserCompletedSeries(userId);
      return res.status(200).json({ success: true, data: completedSeries });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao buscar séries concluídas" });
    }
  }

  async checkSeriesCompleted(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId } = req.params;
    if (!tituloId) {
      return res
        .status(400)
        .json({ success: false, error: "ID do título è obrigatório" });
    }

    try {
      const isCompleted = await this.service.isSeriesCompleted(
        userId,
        parseInt(tituloId)
      );
      return res.status(200).json({ success: true, data: { isCompleted } });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "Erro ao verificar se série está concluída",
      });
    }
  }

  // Métodos para Episódios Assistidos
  async markEpisodeAsWatched(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId, season, episode, duration } = req.body;
    if (!tituloId || !season || !episode || !duration) {
      return res
        .status(400)
        .json({ success: false, error: "Todos os campos são obrigatórios" });
    }

    try {
      const watchedEpisode = await this.service.markEpisodeAsWatched({
        userId,
        tituloId,
        season,
        episode,
        duration,
      });
      return res.status(201).json({ success: true, data: watchedEpisode });
    } catch (error: any) {
      const msg =
        error.message === "Este episódio já está marcado como assistido"
          ? error.message
          : "Erro ao marcar episódio como assistido";
      const status =
        error.message === "Este episódio já está marcado como assistido"
          ? 400
          : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async unmarkEpisodeAsWatched(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId, season, episode } = req.params;
    if (!tituloId || !season || !episode) {
      return res
        .status(400)
        .json({ success: false, error: "Todos os campos são obrigatórios" });
    }

    try {
      await this.service.unmarkEpisodeAsWatched(
        userId,
        parseInt(tituloId),
        parseInt(season),
        parseInt(episode)
      );
      return res.status(200).json({
        success: true,
        data: { message: "Episódio desmarcado como assistido com sucesso" },
      });
    } catch (error: any) {
      const msg =
        error.message === "Episódio não encontrado nos assistidos"
          ? error.message
          : "Erro ao desmarcar episódio como assistido";
      const status =
        error.message === "Episódio não encontrado nos assistidos" ? 404 : 500;
      return res.status(status).json({ success: false, error: msg });
    }
  }

  async getUserWatchedEpisodes(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    try {
      const watchedEpisodes = await this.service.getUserWatchedEpisodes(userId);
      return res.status(200).json({ success: true, data: watchedEpisodes });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao buscar episódios assistidos" });
    }
  }

  async checkEpisodeWatched(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Usuário não autenticado" });
    }

    const { tituloId, season, episode } = req.params;
    if (!tituloId || !season || !episode) {
      return res
        .status(400)
        .json({ success: false, error: "Todos os campos são obrigatórios" });
    }

    try {
      const isWatched = await this.service.isEpisodeWatched(
        userId,
        parseInt(tituloId),
        parseInt(season),
        parseInt(episode)
      );
      return res.status(200).json({ success: true, data: { isWatched } });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "Erro ao verificar se episódio está assistido",
      });
    }
  }
}
