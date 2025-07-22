import {
  PrismaClient,
  Favorite,
  CompletedSeries,
  WatchedEpisode,
} from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaMediaRepository {
  // Métodos para Favoritos
  async createFavorite(data: {
    userId: string;
    titulo: string;
    tituloId: number;
    numberEpisodes?: number;
    numberSeasons?: number;
    type?: string;
  }): Promise<Favorite> {
    return prisma.favorite.create({
      data: {
        userId: data.userId,
        titulo: data.titulo,
        tituloId: data.tituloId,
        numberEpisodes: data.numberEpisodes,
        numberSeasons: data.numberSeasons,
        type: data.type,
      },
    });
  }

  async findFavoriteByUserIdAndTituloId(
    userId: string,
    tituloId: number
  ): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        userId_tituloId: {
          userId,
          tituloId,
        },
      },
    });
  }

  async findFavoritesByUserId(userId: string): Promise<Favorite[]> {
    return prisma.favorite.findMany({
      where: { userId },
    });
  }

  async deleteFavorite(userId: string, tituloId: number): Promise<void> {
    await prisma.favorite.delete({
      where: {
        userId_tituloId: {
          userId,
          tituloId,
        },
      },
    });
  }

  // Métodos para Séries Concluídas
  async createCompletedSeries(data: {
    userId: string;
    tituloId: number;
  }): Promise<CompletedSeries> {
    return prisma.completedSeries.create({
      data: {
        userId: data.userId,
        tituloId: data.tituloId,
      },
    });
  }

  async findCompletedSeriesByUserIdAndTituloId(
    userId: string,
    tituloId: number
  ): Promise<CompletedSeries | null> {
    return prisma.completedSeries.findUnique({
      where: {
        userId_tituloId: {
          userId,
          tituloId,
        },
      },
    });
  }

  async findCompletedSeriesByUserId(
    userId: string
  ): Promise<CompletedSeries[]> {
    return prisma.completedSeries.findMany({
      where: { userId },
    });
  }

  async deleteCompletedSeries(userId: string, tituloId: number): Promise<void> {
    await prisma.completedSeries.delete({
      where: {
        userId_tituloId: {
          userId,
          tituloId,
        },
      },
    });
  }

  // Métodos para Episódios Assistidos
  async createWatchedEpisode(data: {
    userId: string;
    tituloId: number;
    season: number;
    episode: number;
    duration: number;
  }): Promise<WatchedEpisode> {
    return prisma.watchedEpisode.create({
      data: {
        userId: data.userId,
        tituloId: data.tituloId,
        season: data.season,
        episode: data.episode,
        duration: data.duration,
      },
    });
  }

  async findWatchedEpisodeByUserIdAndTituloIdAndSeasonAndEpisode(
    userId: string,
    tituloId: number,
    season: number,
    episode: number
  ): Promise<WatchedEpisode | null> {
    return prisma.watchedEpisode.findUnique({
      where: {
        userId_tituloId_season_episode: {
          userId,
          tituloId,
          season,
          episode,
        },
      },
    });
  }

  async findWatchedEpisodesByUserId(userId: string): Promise<WatchedEpisode[]> {
    return prisma.watchedEpisode.findMany({
      where: { userId },
    });
  }

  async deleteWatchedEpisode(
    userId: string,
    tituloId: number,
    season: number,
    episode: number
  ): Promise<void> {
    await prisma.watchedEpisode.delete({
      where: {
        userId_tituloId_season_episode: {
          userId,
          tituloId,
          season,
          episode,
        },
      },
    });
  }
}
