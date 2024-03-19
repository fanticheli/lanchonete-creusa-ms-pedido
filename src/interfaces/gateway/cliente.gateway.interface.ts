import { ClienteOutput } from "../../adapters/cliente";
import { ClienteProps } from "../../entities/props/cliente.props";

export interface IClienteGateway {
	BuscarTodosClientes(): Promise<ClienteOutput[] | null>;
	CriarCliente(clienteProps: ClienteProps): Promise<ClienteOutput>;
	BuscarClientePorCPF(CPF: string): Promise<ClienteOutput | null>;
	DeletaClientePorCPF(CPF: string): Promise<any>;
}
