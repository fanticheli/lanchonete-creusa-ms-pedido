import axios from "axios";
import { ClienteOutput } from "../adapters/cliente";
import { Cliente } from "../entities/cliente.entity";
import { ClienteProps } from "../entities/props/cliente.props";
import { IClienteGateway } from "../interfaces";
import { IPedidoGateway } from "../interfaces/gateway/pedido.gateway.interface";

export class ClienteUseCases {
	static async CriarCliente(
		clienteGatewayInterface: IClienteGateway,
		clienteProps: ClienteProps
	): Promise<ClienteOutput> {
		const novoCliente = new Cliente(clienteProps);
		const clienteExistente =
			await clienteGatewayInterface.BuscarClientePorCPF(novoCliente.cpf);

		if (clienteExistente) {
			throw new Error("Cliente já cadastrado");
		}

		return clienteGatewayInterface.CriarCliente(novoCliente.object);
	}

	static async BuscarClientePorCPF(
		clienteGatewayInterface: IClienteGateway,
		CPF: string
	): Promise<ClienteOutput | null> {
		return clienteGatewayInterface.BuscarClientePorCPF(CPF);
	}

	static async BuscarTodosClientes(
		clienteGatewayInterface: IClienteGateway
	): Promise<ClienteOutput[] | null> {
		return clienteGatewayInterface.BuscarTodosClientes();
	}

	static async DeletaClientePorCPF(
		clienteGatewayInterface: IClienteGateway,
		pedidoGatewayInterface: IPedidoGateway,
		CPF: string
	): Promise<boolean> {
		const cliente = await clienteGatewayInterface.BuscarClientePorCPF(CPF);

		if (!cliente || !cliente.id) {
			throw new Error("Cliente não encontrado");
		}

		const pedidos = await pedidoGatewayInterface.BuscarPedidosPorCliente(cliente.id);

		if (pedidos) {
			for (const pedido of pedidos) {
				await axios.delete(`${process.env.WEBHOOK_DELETE_PAGAMENTOS}/${pedido.numeroPedido}`);
			}
		}

		await clienteGatewayInterface.DeletaClientePorCPF(CPF);

		return true;
	}
}
