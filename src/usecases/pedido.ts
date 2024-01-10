import { PedidoOutput } from "../adapters/pedido";
import { StatusPagamentoEnum } from "../common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";
import { Pedido } from "../entities/pedido.entity";
import { PedidoProps } from "../entities/props/pedido.props";
import { IPedidoGateway } from "../interfaces/gateway/pedido.gateway.interface";
import { IProdutoGateway } from "../interfaces/gateway/produto.gateway.interface";

export class PedidoUseCases {
	static async CriarPedido(
		pedidoGatewayInterface: IPedidoGateway,
		produtoGatewayInterface: IProdutoGateway,
		pedidoProps: PedidoProps
	) {
		const novoPedido = new Pedido(pedidoProps);

		for (const produto of novoPedido.produtos) {
			const produtoEncontrado =
				await produtoGatewayInterface.BuscarProdutoPorID(produto);

			if (!produtoEncontrado) {
				throw new Error(`Produto: ${produto} não encontrado`);
			}

			novoPedido.valorTotal =
				novoPedido.valorTotal + produtoEncontrado.valor;
		}

		novoPedido.numeroPedido =
			await pedidoGatewayInterface.NumeroNovoPedido();

		return pedidoGatewayInterface.CriarPedido(novoPedido.object);
	}
}
