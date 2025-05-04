export default class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static validateRaw(name: string, email: string, password: string): boolean {
    return name.length >= 3 && email.includes("@") && password.length >= 6;
  }

  validate(): boolean {
    return User.validateRaw(this.name, this.email, this.password);
  }
}
