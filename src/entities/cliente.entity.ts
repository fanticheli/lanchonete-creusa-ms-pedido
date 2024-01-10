import { ClienteProps } from './props/cliente.props';
import { Email } from './valuesObjects/email';
import { CPF } from './valuesObjects/cpf';

export class Cliente {
    private _id?: string | undefined;
    private _nome: string;
    private _email: Email;
    private _CPF: CPF;

    constructor(clienteProps: ClienteProps) {
        if (clienteProps.id) {
            this._id = clienteProps.id;
        }
        this._nome = clienteProps.nome;
        this._email = new Email(clienteProps.email);
        this._CPF = new CPF(clienteProps.cpf);
    }

    get id(): string | undefined {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get email(): string {
        return this._email.email;
    }

    get cpf(): string {
        return this._CPF.cpf;
    }

    get object(): ClienteProps {
        return {
            id: this._id,
            nome: this._nome,
            email: this._email.email,
            cpf: this._CPF.cpf
        }
    }

    set id(id: string) {
        this._id = id;
    }
}