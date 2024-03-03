import amqp from 'amqplib';
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

		const wasPublished = await PedidoUseCases.EnviarParaPagamento(novoPedido);

		if (!wasPublished) {
			throw new Error('Não foi possível enviar o pedido para pagamento');
		}

		return pedidoGatewayInterface.CriarPedido(novoPedido.object);
	}

	static async EnviarParaPagamento(pedido: PedidoOutput) {
		try {
			const connection = await amqp.connect(process.env.QUEUE_HOST || '');
			const channel = await connection.createConfirmChannel();
			const queueName = process.env.QUEUE_PEDIDOS_NAME || '';
			await channel.assertQueue(queueName, { durable: true });
			const messageContent = JSON.stringify({
				id: pedido.id,
				cliente: pedido.cliente,
				valorTotal: pedido.valorTotal,
				numeroPedido: pedido.numeroPedido
			});
			await channel.sendToQueue(queueName, Buffer.from(messageContent), undefined, (err) => {
				if (err !== null) throw err;
				connection.close();
			});
			return true;
		}
		catch (error) {
			throw new Error('Meio de pagamento não configurado');
		}
	}

	static async AlterarStatusPagamentoPedido(
		pedidoGatewayInterface: IPedidoGateway,
		produtoGatewayInterface: IProdutoGateway,
		numeroPedido: number,
		statusPagamento: StatusPagamentoEnum
	): Promise<PedidoOutput> {
		if (!Object.values(StatusPagamentoEnum).includes(statusPagamento)) {
			throw new Error("Status de pedido inválido");
		}

		const pedidoEncontrado = await pedidoGatewayInterface.BuscarPedidoPorNumero(numeroPedido);

		if (!pedidoEncontrado) {
			throw new Error("Pedido não encontrado");
		}

		pedidoEncontrado.statusPagamento = statusPagamento;

		if (statusPagamento === StatusPagamentoEnum.NEGADO) {
			pedidoEncontrado.statusPedido = StatusPedidoEnum.CANCELADO;
		} else if (statusPagamento === StatusPagamentoEnum.APROVADO) {
			pedidoEncontrado.statusPedido = StatusPedidoEnum.PREPARACAO;

			const wasPublished = await PedidoUseCases.MandarPedidoParaProducao(pedidoEncontrado, produtoGatewayInterface);

			if (!wasPublished) {
				throw new Error('Não foi possível enviar o pedido para produção');
			}
		}

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}

	static async MandarPedidoParaProducao(
		pedido: PedidoOutput,
		produtoGatewayInterface: IProdutoGateway
	): Promise<boolean> {
		try {
			const produtos = await Promise.all(pedido.produtos.map(async (produto) => {
				const produtoEncontrado = await produtoGatewayInterface.BuscarProdutoPorID(produto);

				if (!produtoEncontrado) {
					throw new Error(`Produto: ${produto} não encontrado`);
				}

				return { descricao: produtoEncontrado.descricao, valor: produtoEncontrado.valor };
			}));
			const connection = await amqp.connect(process.env.QUEUE_HOST || '');
			const channel = await connection.createConfirmChannel();
			const queueName = process.env.QUEUE_PRODUCAO_NAME || '';
			await channel.assertQueue(queueName, { durable: true });
			const messageContent = JSON.stringify({
				"id": pedido.id,
				"cliente": pedido.cliente,
				"produtos": produtos,
				"numeroPedido": pedido.numeroPedido
			});
			await channel.sendToQueue(queueName, Buffer.from(messageContent), undefined, (err) => {
				if (err !== null) throw err;
				connection.close();
			});
			return true;
		}
		catch (error) {
			throw error;
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
