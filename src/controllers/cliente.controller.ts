import { ClienteOutput } from "../adapters/cliente";
import { ClienteProps } from "../entities/props/cliente.props";
import { IClienteGateway } from "../interfaces";
import { ClienteUseCases } from "../usecases/cliente";

export class ClienteController {
	static async BuscarTodosClientes(
		clienteGatewayInterface: IClienteGateway
	): Promise<ClienteOutput[] | null> {
		try {
			return await ClienteUseCases.BuscarTodosClientes(
				clienteGatewayInterface
			);
		} catch (error) {
			throw error;
		}
	}

	static async CriarCliente(
		clienteGatewayInterface: IClienteGateway,
		clienteProps: ClienteProps
	): Promise<ClienteOutput> {
		try {
			return await ClienteUseCases.CriarCliente(
				clienteGatewayInterface,
				clienteProps
			);
		} catch (error) {
			throw error;
		}
	}

	static async BuscarClientePorCPF(
		clienteGatewayInterface: IClienteGateway,
		cpf: string
	): Promise<ClienteOutput | null> {
		try {
			return await ClienteUseCases.BuscarClientePorCPF(
				clienteGatewayInterface,
				cpf
			);
		} catch (error) {
			throw error;
		}
	}
}
