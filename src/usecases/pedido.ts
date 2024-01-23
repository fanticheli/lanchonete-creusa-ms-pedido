import axios from 'axios';
import { PedidoOutput } from "../adapters/pedido";
import { Pedido } from "../entities/pedido.entity";
import { PedidoProps } from "../entities/props/pedido.props";
import { IPedidoGateway } from "../interfaces/gateway/pedido.gateway.interface";
import { IProdutoGateway } from "../interfaces/gateway/produto.gateway.interface";
import { StatusPagamentoEnum } from '../common/enum/status-pagamento-enum';
import { StatusPedidoEnum } from '../common/enum/status-pedido-enum';

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

		const pagamento = await PedidoUseCases.CriarPagamento(novoPedido);

		novoPedido.codigoParaPagamento = pagamento.codigoPix;

		return pedidoGatewayInterface.CriarPedido(novoPedido.object);
	}

	static async CriarPagamento(
		pedido: PedidoOutput
	) {
		const apiUrl = process.env.URL_MS_PAGAMENTO || '';

		if (!apiUrl) {
			throw new Error('Meio de pagamento não configurado');
		}

		try {
			const pagamento = await axios.post(apiUrl, {
				valorTotal: pedido.valorTotal,
			});

			return pagamento.data;
		}
		catch (error) {
			throw new Error('Não foi possível realizar o pagamento');
		}
	}

	static async AlterarStatusPagamentoPedido(
		pedidoGatewayInterface: IPedidoGateway,
		codigoPagamento: string,
		statusPagamento: StatusPagamentoEnum
	): Promise<PedidoOutput> {
		if (!Object.values(StatusPagamentoEnum).includes(statusPagamento)) {
			throw new Error("Status de pedido inválido");
		}

		const pedidoEncontrado = await pedidoGatewayInterface.BuscarPedidoPorCodigoPagamento(
			codigoPagamento
		);

		if (!pedidoEncontrado) {
			throw new Error("Pedido não encontrado");
		}

		pedidoEncontrado.statusPagamento = statusPagamento;

		if (statusPagamento === StatusPagamentoEnum.NEGADO) {
			pedidoEncontrado.statusPedido = StatusPedidoEnum.CANCELADO;
		} else if (statusPagamento === StatusPagamentoEnum.APROVADO) {
			//TODO: chamar endpoint de produção
			pedidoEncontrado.statusPedido = StatusPedidoEnum.PREPARACAO;
		}

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}
}
