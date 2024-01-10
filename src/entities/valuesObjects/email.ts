export class Email {
    private _email: string;

    constructor(email: string) {
        if (!this.validar(email)) {
            throw new Error("Endereço de e-mail inválido!");
        }
        this._email = email;
    }

    validar(email: string): boolean {
        return /\S+@\S+\.\S+/.test(email);
    }

    get email(): string {
        return this._email;
    }
}