import { ClienteProps } from "../../src/entities/props/cliente.props"
import { ClienteRepositoryInMemory } from "../../src/external/memory/cliente.repository"
import { ClienteUseCases } from "../../src/usecases/cliente"

describe('Cliente usecases', () => {

    const clienteRepository = new ClienteRepositoryInMemory();

    test('should create a new client', async () => {
        const clienteProps: ClienteProps = {
            id: '1',
            nome: 'João',
            email: 'joão@joão.com.br',
            cpf: '360.635.210-70'
        }
        const novoCliente = await ClienteUseCases.CriarCliente(clienteRepository, clienteProps)
        const clientes = await ClienteUseCases.BuscarTodosClientes(clienteRepository);

        expect(novoCliente).toBeDefined()
        expect(novoCliente?.id).toBe('1')
        expect(novoCliente?.nome).toBe('João')
        expect(novoCliente?.email).toBe('joão@joão.com.br')
        expect(novoCliente?.cpf).toBe('36063521070')
        expect(clientes).toBeDefined()
        expect(clientes).toHaveLength(1)
    })

    test('should find a client by CPF', async () => {
        const cliente = await ClienteUseCases.BuscarClientePorCPF(clienteRepository, '36063521070');
        
        expect(cliente).toBeDefined()
        expect(cliente?.id).toBe('1')
        expect(cliente?.nome).toBe('João')
        expect(cliente?.email).toBe('joão@joão.com.br')
        expect(cliente?.cpf).toBe('36063521070')
    })

})