import { Cliente } from "../../src/entities/cliente.entity";
import { ClienteProps } from "../../src/entities/props/cliente.props";

describe('Cliente', () => {
    test('should be defined', () => {
        expect(true).toBeDefined();
    })

    test('Create a new Cliente', () => {
        const clienteProps: ClienteProps = {
            id: '1',
            nome: 'João',
            email: 'joão@joão.com.br',
            cpf: '360.635.210-70'
        }

        const cliente = new Cliente(clienteProps);
        expect(cliente).toBeInstanceOf(Cliente);
        expect(cliente.id).toBe('1');
        expect(cliente.nome).toBe('João');
        expect(cliente.email).toBe('joão@joão.com.br');
        expect(cliente.cpf).toBe('36063521070');
    })
})