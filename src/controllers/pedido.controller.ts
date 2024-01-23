import { PedidoOutput } from "../adapters/pedido";
import { StatusPagamentoEnum } from "../common/enum/status-pagamento-enum";
import { PedidoProps } from "../entities/props/pedido.props";
import { IPedidoGateway } from "../interfaces/gateway/pedido.gateway.interface";
import { IProdutoGateway } from "../interfaces/gateway/produto.gateway.interface";
import { PedidoUseCases } from "../usecases/pedido";

export class PedidoController {
	static async CriarPedido(
		pedidoGatewayInterface: IPedidoGateway,
		produtoGatewayInterface: IProdutoGateway,
		pedidoProps: PedidoProps
	): Promise<PedidoOutput> {
		try {
			return await PedidoUseCases.CriarPedido(
				pedidoGatewayInterface,
				produtoGatewayInterface,
				pedidoProps
			);
		} catch (error) {
			throw error;
		}
	}

	static async AlterarStatusPagamentoPedido(
		pedidoGatewayInterface: IPedidoGateway,
		codigoPagamento: string,
		statusPagamento: StatusPagamentoEnum
	): Promise<PedidoOutput | null> {
		try {
			return await PedidoUseCases.AlterarStatusPagamentoPedido(
				pedidoGatewayInterface,
				codigoPagamento,
				statusPagamento
			);
		} catch (error) {
			throw error;
		}
	}
}
