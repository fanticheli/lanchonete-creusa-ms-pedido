import { ClienteAdapter, ClienteOutput } from "../../adapters/cliente";
import { Cliente } from "../../entities/cliente.entity";
import { ClienteProps } from "../../entities/props/cliente.props";
import { IClienteGateway } from "../../interfaces";

export class ClienteRepositoryInMemory implements IClienteGateway {
	private clientes: Cliente[] = [];

	async CriarCliente(clienteProps: ClienteProps): Promise<ClienteOutput> {
        const novoCliente = new Cliente(clienteProps)
		this.clientes.push(novoCliente);
		novoCliente.id = this.clientes.length.toString();
		return novoCliente.object;	
	}

	async BuscarClientePorCPF(cpf: string): Promise<ClienteOutput | null> {
		const cliente = this.clientes.find((cliente) => cliente.cpf === cpf);

		if (!cliente) {
			return null;
		}

		return ClienteAdapter.adaptJsonCliente(cliente);
	}

	async BuscarTodosClientes(): Promise<ClienteOutput[] | null> {
		return ClienteAdapter.adaptJsonClientes(this.clientes);
	}

	async DeletaClientePorCPF(cpf: string): Promise<any> {
		const cliente = this.clientes.find((cliente) => cliente.cpf === cpf);

		if (!cliente) {
			return false;
		}

		this.clientes = this.clientes.filter(cliente => cliente.cpf !== cpf);

		return true;
	}
}
