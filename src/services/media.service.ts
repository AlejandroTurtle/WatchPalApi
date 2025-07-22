import { Favorite, CompletedSeries, WatchedEpisode } from "@prisma/client";
import { PrismaMediaRepository } from "../repository/prismaMediaRepository";

export default class MediaService {
  constructor(private repository: PrismaMediaRepository) {}

  // Métodos para Favoritos
  async addFavorite(data: {
    userId: string;
    titulo: string;
    tituloId: number;
    numberEpisodes?: number;
    numberSeasons?: number;
    type?: string;
  }): Promise<Favorite> {
    const existingFavorite =
      await this.repository.findFavoriteByUserIdAndTituloId(
        data.userId,
        data.tituloId
      );

    if (existingFavorite) {
      throw new Error("Este título já está nos favoritos");
    }

    return this.repository.createFavorite(data);
  }

  async removeFavorite(userId: string, tituloId: number): Promise<void> {
    const favorite = await this.repository.findFavoriteByUserIdAndTituloId(
      userId,
      tituloId
    );

    if (!favorite) {
      throw new Error("Favorito não encontrado");
    }

    await this.repository.deleteFavorite(userId, tituloId);
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.repository.findFavoritesByUserId(userId);
  }

  async isFavorite(userId: string, tituloId: number): Promise<boolean> {
    const favorite = await this.repository.findFavoriteByUserIdAndTituloId(
      userId,
      tituloId
    );
    return !!favorite;
  }

  // Métodos para Séries Concluídas
  async markSeriesAsCompleted(data: {
    userId: string;
    tituloId: number;
  }): Promise<CompletedSeries> {
    const existingCompleted =
      await this.repository.findCompletedSeriesByUserIdAndTituloId(
        data.userId,
        data.tituloId
      );

    if (existingCompleted) {
      throw new Error("Esta série já está marcada como concluída");
    }

    return this.repository.createCompletedSeries(data);
  }

  async unmarkSeriesAsCompleted(
    userId: string,
    tituloId: number
  ): Promise<void> {
    const completedSeries =
      await this.repository.findCompletedSeriesByUserIdAndTituloId(
        userId,
        tituloId
      );

    if (!completedSeries) {
      throw new Error("Série não encontrada nos concluídos");
    }

    await this.repository.deleteCompletedSeries(userId, tituloId);
  }

  async getUserCompletedSeries(userId: string): Promise<CompletedSeries[]> {
    return this.repository.findCompletedSeriesByUserId(userId);
  }

  async isSeriesCompleted(userId: string, tituloId: number): Promise<boolean> {
    const completedSeries =
      await this.repository.findCompletedSeriesByUserIdAndTituloId(
        userId,
        tituloId
      );
    return !!completedSeries;
  }

  // Métodos para Episódios Assistidos
  async markEpisodeAsWatched(data: {
    userId: string;
    tituloId: number;
    season: number;
    episode: number;
    duration: number;
  }): Promise<WatchedEpisode> {
    const existingWatched =
      await this.repository.findWatchedEpisodeByUserIdAndTituloIdAndSeasonAndEpisode(
        data.userId,
        data.tituloId,
        data.season,
        data.episode
      );

    if (existingWatched) {
      throw new Error("Este episódio já está marcado como assistido");
    }

    return this.repository.createWatchedEpisode(data);
  }

  async unmarkEpisodeAsWatched(
    userId: string,
    tituloId: number,
    season: number,
    episode: number
  ): Promise<void> {
    const watchedEpisode =
      await this.repository.findWatchedEpisodeByUserIdAndTituloIdAndSeasonAndEpisode(
        userId,
        tituloId,
        season,
        episode
      );

    if (!watchedEpisode) {
      throw new Error("Episódio não encontrado nos assistidos");
    }

    await this.repository.deleteWatchedEpisode(
      userId,
      tituloId,
      season,
      episode
    );
  }

  async getUserWatchedEpisodes(userId: string): Promise<WatchedEpisode[]> {
    return this.repository.findWatchedEpisodesByUserId(userId);
  }

  async isEpisodeWatched(
    userId: string,
    tituloId: number,
    season: number,
    episode: number
  ): Promise<boolean> {
    const watchedEpisode =
      await this.repository.findWatchedEpisodeByUserIdAndTituloIdAndSeasonAndEpisode(
        userId,
        tituloId,
        season,
        episode
      );
    return !!watchedEpisode;
  }
}
