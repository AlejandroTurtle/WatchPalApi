import { BaseRepository } from "../repository/generic.repository";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Favorite, User } from "@prisma/client";
import { smtp } from "../config/smtp";
import { PrismaPasswordResetRepository } from "../repository/prismaPasswordResetRepository";
import { PrismaMediaRepository } from "../repository/prismaMediaRepository";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function getDataHoraLocal(): Date {
  const data = new Date();
  const offset = data.getTimezoneOffset() * 60 * 1000;
  const dataLocal = new Date(data.getTime() - offset);
  return dataLocal;
}

export default class UserService {
  constructor(
    private repo: BaseRepository<User>,
    private resetRepo: PrismaPasswordResetRepository
  ) {}

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; token: string }> {
    const users = await this.repo.findAll();
    const user = users.find((user) => user.email === email);

    if (!user) {
      return { user: null, token: "" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { user: null, token: "" };
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async create(data: Omit<User, "id">): Promise<{ user: User; token: string }> {
    // Validação básica
    if (!data.nome || !data.email || !data.password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Verifica se o email ja existe
    const users = await this.repo.findAll();
    const userExists = users.find((user) => user.email === data.email);
    if (userExists) {
      throw new Error("Já existe um usuario cadastrado com esse email");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.repo.create({
      id: uuidv4(),
      nome: data.nome,
      email: data.email,
      password: hashedPassword,
      createdAt: getDataHoraLocal(),
      updatedAt: getDataHoraLocal(),
      celular: data.celular,
      foto: data.foto,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    // Se estiver atualizando a senha, faz o hash
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: getDataHoraLocal(),
    } as User;

    return this.repo.update(id, updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    await this.repo.delete(id);
    return true;
  }

  async deleteAll(): Promise<boolean> {
    await this.repo.deleteAll();
    return true;
  }

  async sendEmailRecoverPassword(email: string): Promise<boolean> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new Error("Email não encontrado");
    }
    const nome = user.nome;

    const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.resetRepo.create({
      userId: user.id,
      code,
      expiresAt,
    });

    let message = {
      to: email,
      subject: "Recuperação de Senha",
      text: "Copie o código abaixo para recuperar sua senha e adicione ao app para recuperar sua senha",
      html: `
      <p>Olá ${nome},</p>
      <p><strong>Copie o código abaixo e adicione ao app para recuperar sua senha:</strong></p>
      <p>O código vai estar válido até ${expiresAt.toLocaleString()}</p>
      <p>${code}</p>
      <p>Atenciosamente,</p>
      <p>Equipe de suporte</p>
    `,
    };
    smtp.sendMail(message);
    console.log("Email enviado com sucesso");
    return true;
  }

  async verifyResetCode(code: string, newPassword: string): Promise<boolean> {
    const reset = await this.resetRepo.findValidByCode(code);
    if (!reset) {
      throw new Error("Código inválido ou expirado");
    }

    const userId = reset.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = {
      password: hashedPassword,
    } as User;

    await this.repo.update(userId, updatedUser);

    await this.resetRepo.deleteById(reset.id);

    return true;
  }

  async resendCode(email: string): Promise<boolean> {
    await this.sendEmailRecoverPassword(email);
    return true;
  }

  async validadeToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, JWT_SECRET!);
      return true;
    } catch (error) {
      return false;
    }
  }

  async userData(userId: string): Promise<Partial<User> | null> {
    try {
      const user = await this.repo.findById(userId);

      if (!user) {
        return null;
      }

      const userFavorites = await this.repo.findFavoritesByUserId(userId);

      const dataUser: Partial<User> & { favorites: { tituloId: number }[] } = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        celular: user.celular,
        foto: user.foto,
        favorites: userFavorites.map((favorite) => ({
          tituloId: favorite.tituloId,
        })),
      };

      return dataUser;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  }
}
