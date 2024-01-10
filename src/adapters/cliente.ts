import { Cliente } from "../entities/cliente.entity";

export interface ClienteOutput {
	id?: string;
	nome: string;
	email: string;
	cpf: string;
}

export const ClienteAdapter = {
	adaptJsonClientes: function (
		clientes: Cliente[] | null
	): ClienteOutput[] | null {
		if (clientes === null) {
			return null;
		}

		return clientes.map(function (item) {
			return {
				id: item.id,
				nome: item.nome,
				email: item.email,
				cpf: item.cpf,
			};
		});
	},
	adaptJsonCliente: function (cliente: Cliente): ClienteOutput {
		return {
			id: cliente.id,
			nome: cliente.nome,
			email: cliente.email,
			cpf: cliente.cpf,
		};
	},
};
