import { PrismaClient, PasswordReset } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaPasswordResetRepository {
  async create(params: {
    userId: string;
    code: string;
    expiresAt: Date;
  }): Promise<PasswordReset> {
    return prisma.passwordReset.create({
      data: {
        userId: params.userId,
        code: params.code,
        expiresAt: params.expiresAt,
      },
    });
  }

  async findValidByCode(code: string): Promise<PasswordReset | null> {
    return prisma.passwordReset.findFirst({
      where: { code, expiresAt: { gt: new Date() } },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.passwordReset.delete({ where: { id } });
  }

  async deleteExpired(): Promise<number> {
    const { count } = await prisma.passwordReset.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return count;
  }
}
