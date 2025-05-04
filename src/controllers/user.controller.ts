import { Request, Response } from "express";
import UserService from "../services/user.service";
import User from "../models/user.model";

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
          .json({ sucess: false, error: "Usuário ou senha incorretos" });
      }
      res.json({
        sucess: true,
        data: {
          ...user,
          password: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          token,
        },
      });
    } catch (error: any) {
      res.status(400).json({ sucess: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await this.service.create(userData);
      res.status(201).json({
        sucess: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ sucess: false, error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.service.findAll();
      res.json({ sucess: true, data: users });
    } catch (error: any) {
      res.status(500).json({ sucess: false, error: "Erro ao buscar usuários" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ sucess: false, error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ sucess: false, error: "Erro ao buscar usuário" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.service.update(id, userData);
      if (!updatedUser) {
        return res
          .status(404)
          .json({ sucess: false, error: "Usuário não encontrado" });
      }
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ sucess: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.service.delete(id);
      if (!success) {
        return res
          .status(404)
          .json({ sucess: false, error: "Usuário não encontrado" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ sucess: false, error: "Erro ao deletar usuário" });
    }
  }
}
