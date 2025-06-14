import { Favorite, PrismaClient, User } from "@prisma/client";
import { BaseRepository } from "./generic.repository";

const prisma = new PrismaClient();

export class PrismaUserRepository implements BaseRepository<User> {
  async create(item: User): Promise<User> {
    return prisma.user.create({ data: item });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, item: User): Promise<User | null> {
    return prisma.user.update({ where: { id }, data: item });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async deleteAll(): Promise<boolean> {
    await prisma.user.deleteMany();
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findFavoritesByUserId(userId: string): Promise<Favorite[]> {
    return prisma.favorite.findMany({
      where: { userId },
    });
  }
}
