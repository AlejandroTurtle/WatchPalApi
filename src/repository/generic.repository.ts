export interface BaseRepository<T> {
  create(item: T): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<boolean>;
  findByEmail(email: string): Promise<T | null>;
}
