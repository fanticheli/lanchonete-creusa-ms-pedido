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
			throw error;
		}
	}

	static async AlterarStatusPagamentoPedido(
		pedidoGatewayInterface: IPedidoGateway,
		produtoGatewayInterface: IProdutoGateway,
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
			pedidoEncontrado.statusPedido = StatusPedidoEnum.PREPARACAO;

			await PedidoUseCases.MandarPedidoParaProducao(pedidoEncontrado, produtoGatewayInterface);
		}

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}

	static async MandarPedidoParaProducao(
		pedido: PedidoOutput,
		produtoGatewayInterface: IProdutoGateway
	): Promise<any> {

		const apiUrl = process.env.URL_MS_PRODUCAO || '';

		if (!apiUrl) {
			throw new Error('Webhook de PRODUÇÃO não configurado');
		}

		try {

			const produtos = await Promise.all(pedido.produtos.map(async (produto) => {
				const produtoEncontrado = await produtoGatewayInterface.BuscarProdutoPorID(produto);
	
				if (!produtoEncontrado) {
					throw new Error(`Produto: ${produto} não encontrado`);
				}
	
				return {descricao: produtoEncontrado.descricao, valor: produtoEncontrado.valor};
			}));

			const result = await axios.post(`${apiUrl}`, {
				"id": pedido.id,
				"cliente": pedido.cliente,
				"produtos": produtos,
				"numeroPedido": pedido.numeroPedido
			});

			return result.data;
		}
		catch (error) {
			throw new Error('Não foi possível chamar o webhook de produção');
		}

	}

	static async AlterarStatusPedido(
		pedidoGatewayInterface: IPedidoGateway,
		pedidoID: string,
		statusPedido: StatusPedidoEnum
	): Promise<PedidoOutput> {
		if (!Object.values(StatusPedidoEnum).includes(statusPedido)) {
			throw new Error("Status de pedido inválido");
		}

		const pedidoEncontrado = await pedidoGatewayInterface.BuscarPedidoPorID(
			pedidoID
		);

		if (!pedidoEncontrado) {
			throw new Error("Pedido não encontrado");
		}

		pedidoEncontrado.statusPedido = statusPedido;

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}
}
