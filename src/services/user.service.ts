import { BaseRepository } from "../repository/generic.repository";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "@prisma/client";

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
  constructor(private repo: BaseRepository<User>) {}

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
}
