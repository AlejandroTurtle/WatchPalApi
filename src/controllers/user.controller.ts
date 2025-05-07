import { Request, Response } from "express";
import UserService from "../services/user.service";
import User from "../models/user.model";
import { uploadBuffer } from "../config/cloudinary";

export default class UserController {
  constructor(private service: UserService) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("email", email, "password", password);
      const { user, token } = await this.service.login(email, password);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: "Usuário ou senha incorretos" });
      }
      res.json({
        success: true,
        data: {
          ...user,
          password: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          foto: user.foto,
          celular: user.celular,
          token,
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      // se veio arquivo, faz upload por stream
      let fotoUrl: string | null = null;
      if (req.file) {
        fotoUrl = await uploadBuffer(req.file.buffer);
      }

      // monta o objeto que seu service espera
      const userData = {
        ...req.body,
        foto: fotoUrl,
      };

      const { user, token } = await this.service.create(userData);
      res.status(201).json({ success: true, data: user, token });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.service.findAll();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao buscar usuários" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ success: false, error: "Erro ao buscar usuário" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      let fotoUrl: string | undefined;
      if (req.file) {
        fotoUrl = await uploadBuffer(req.file.buffer);
      }

      const userData = {
        ...req.body,
        ...(fotoUrl ? { foto: fotoUrl } : {}),
      };

      const updatedUser = await this.service.update(req.params.id, userData);
      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, error: "Usuário não encontrado" });
      }
      res.json({ success: true, data: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.service.delete(id);
      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "Usuário não encontrado" });
      }
      res.status(204).send();
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao deletar usuário" });
    }
  }

  async deleteAllUsers(req: Request, res: Response) {
    try {
      await this.service.deleteAll();
      res.status(200).json({ success: true, message: "Usuários deletados" });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao deletar usuários" });
    }
  }
}
