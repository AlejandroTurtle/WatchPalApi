export interface Projeto {
  url: string;
}

export class InMemoryProjetoRepository {
  private projetos: Projeto[] = [];

  save(projeto: Projeto) {
    this.projetos.push(projeto);
  }

  getAll(): Projeto[] {
    return this.projetos;
  }
}
