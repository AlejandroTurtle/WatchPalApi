import User from "../models/user.model";
import { BaseRepository } from "./generic.repository";

// A classe InMemoryUserRepository implementa a interface BaseRepository<User>,
// ou seja, ela assume o "contrato" de oferecer métodos de CRUD para objetos do tipo User.
export class InMemoryUserRepository implements BaseRepository<User> {
  // "items" é um array privado que armazena todos os usuários em memória.
  // O modificador "private" impede acesso direto de fora da classe.
  private items: User[] = [];

  /**
   * Cria um novo usuário em memória.
   * @param item - Instância de User a ser adicionada.
   * @returns A promise que resolve para o mesmo objeto User adicionado.
   */
  async create(item: User): Promise<User> {
    // Adiciona o usuário ao fim do array "items".
    this.items.push(item);
    // Retorna o usuário, simulando uma resposta de banco de dados.
    return item;
  }

  /**
   * Retorna todos os usuários armazenados.
   * @returns A promise que resolve para o array completo de usuários.
   */
  async findAll(): Promise<User[]> {
    // Retorna diretamente o array, sem cópia.
    return this.items;
  }

  /**
   * Busca um usuário pelo seu ID.
   * @param id - Identificador único do usuário.
   * @returns A promise que resolve para o User encontrado ou null se não existir.
   */
  async findById(id: string): Promise<User | null> {
    // find() retorna o primeiro elemento que satisfaz a condição, ou undefined.
    // O operador || null garante que retornamos null em vez de undefined.
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Atualiza um usuário existente.
   * @param id   - ID do usuário a ser atualizado.
   * @param item - Objeto User com os novos valores.
   * @returns A promise que resolve para o User atualizado ou null se não existir.
   */
  async update(id: string, item: User): Promise<User | null> {
    // findIndex() retorna o índice do elemento ou -1 se não encontrar.
    const index = this.items.findIndex((item) => item.id === id);
    // Se não existir, retorna null.
    if (index === -1) {
      return null;
    }
    // Substitui o usuário antigo pelo novo objeto fornecido.
    this.items[index] = item;
    // Retorna o objeto atualizado.
    return item;
  }

  /**
   * Remove um usuário pelo ID.
   * @param id - ID do usuário a ser removido.
   * @returns Uma promise que resolve quando a remoção termina.
   */
  async delete(id: string): Promise<void> {
    // Novamente localiza o índice do usuário.
    const index = this.items.findIndex((item) => item.id === id);
    // Se não encontrado, simplesmente sai, sem lançar erro.
    if (index === -1) {
      return;
    }
    // splice() remove 1 elemento a partir do índice encontrado.
    this.items.splice(index, 1);
  }
}
