export default class User {
  constructor(
    public id: string,
    public nome: string,
    public email: string,
    public password: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static validateRaw(nome: string, email: string, password: string): boolean {
    return nome.length >= 3 && email.includes("@") && password.length >= 6;
  }

  validate(): boolean {
    return User.validateRaw(this.nome, this.email, this.password);
  }
}
