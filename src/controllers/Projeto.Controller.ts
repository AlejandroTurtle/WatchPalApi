import { Request, Response } from "express";
import { InMemoryProjetoRepository } from "../repository/InMemoryProjetoRepository";

export class ProjetoController {
  constructor(private repo: InMemoryProjetoRepository) {}

  salvar = (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    this.repo.save({ url });
    return res.status(201).json({ success: true });
  };

  listar = (req: Request, res: Response) => {
    const projetos = this.repo.getAll();
    return res.json({ success: true, url: projetos[0]?.url });
  };
}
