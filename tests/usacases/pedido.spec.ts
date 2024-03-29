import amqp from 'amqplib';
import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { PedidoProps } from "../../src/entities/props/pedido.props";
import { ProdutoProps } from "../../src/entities/props/produto.props";
import { PedidoRepositoryInMemory } from "../../src/external/memory/pedido.repository";
import { ProdutoRepositoryInMemory } from "../../src/external/memory/produto.repository";
import { PedidoUseCases } from "../../src/usecases/pedido";
import { ProdutoUseCases } from "../../src/usecases/produtos";

jest.mock('amqplib');
class MockChannel {
	assertQueue() {
		return Promise.resolve();
	}

	sendToQueue() {
		return Promise.resolve();
	}
}

class MockConnection {
	createConfirmChannel() {
		return Promise.resolve(new MockChannel());
	}

	createChannel() {
		return Promise.resolve(new MockChannel());
	}

	close() {
		return Promise.resolve();
	}
}
describe("Pedido", () => {
	let produtoRepository = new ProdutoRepositoryInMemory();
	let pedidoRepository = new PedidoRepositoryInMemory();

	beforeEach(() => {
		produtoRepository = new ProdutoRepositoryInMemory();
		pedidoRepository = new PedidoRepositoryInMemory();
		jest.clearAllMocks();
	});

	test("Deve criar um pedido", async () => {
		(amqp.connect as jest.Mock).mockImplementation(() => Promise.resolve(new MockConnection()));

		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.LANCHE,
		};

		await ProdutoUseCases.CriarProduto(produtoRepository, produtoProps);

		const pedidoProps: PedidoProps = {
			produtos: ["1"],
			cliente: "Cliente 1",
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const novoPedido = await PedidoUseCases.CriarPedido(
			pedidoRepository,
			produtoRepository,
			pedidoProps
		);

		expect(novoPedido).toBeDefined();
		expect(novoPedido.id).toBe("01");
		expect(novoPedido.produtos).toHaveLength(1);
		expect(novoPedido.valorTotal).toBe(10);
		expect(novoPedido.numeroPedido).toBe(1);
		expect(novoPedido.cliente).toBe("Cliente 1");
		expect(novoPedido.statusPagamento).toBe(StatusPagamentoEnum.PENDENTE);
		expect(novoPedido.statusPedido).toBe(StatusPedidoEnum.RECEBIDO);
	});

	test("Ao criar pedido, produto não encontrado", async () => {
		const pedidoProps: PedidoProps = {
			produtos: ["1"],
			cliente: "Cliente 1",
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		try {
			await PedidoUseCases.CriarPedido(
				pedidoRepository,
				produtoRepository,
				pedidoProps
			)
		} catch (error: any) {
			expect(error.message).toBe('Produto não encontrado');
		}
	});

	test("Ao criar um pedido, Não foi possível realizar o pagamento", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.LANCHE,
		};

		await ProdutoUseCases.CriarProduto(produtoRepository, produtoProps);

		const pedidoProps: PedidoProps = {
			produtos: ["1"],
			cliente: "Cliente 1",
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		try {
			await PedidoUseCases.CriarPedido(
				pedidoRepository,
				produtoRepository,
				pedidoProps
			);
		} catch (error: any) {
			expect(error.message).toBe('Não foi possível realizar o pagamento');
		}

	});

	test("Ao criar um pedido, Meio de pagamento não configurado", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.LANCHE,
		};

		await ProdutoUseCases.CriarProduto(produtoRepository, produtoProps);

		const pedidoProps: PedidoProps = {
			produtos: ["1"],
			cliente: "Cliente 1",
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		try {
			await PedidoUseCases.CriarPedido(
				pedidoRepository,
				produtoRepository,
				pedidoProps
			);
		} catch (error: any) {
			expect(error.message).toBe('Meio de pagamento não configurado');
		}

	});

	test('Deve criar um pagamento', async () => {
		const mockResponse = {
			data: {
				codigoPix: '987678954',
			},
		};

		(amqp.connect as jest.Mock).mockImplementation(() => Promise.resolve(new MockConnection()));

		const pedidoProps: PedidoProps = {
			produtos: ['1'],
			cliente: 'Cliente 1',
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const novoPagamento = await PedidoUseCases.EnviarParaPagamento(pedidoProps);

		expect(novoPagamento).toBeDefined();
	});

	test('Deve alterar o status do pagamento do pedido NEGADO', async () => {
		const pedidoEncontradoMock = {
			id: '1',
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};


		const numeroPedido = 123456789;
		const statusPagamento = StatusPagamentoEnum.NEGADO;

		pedidoRepository.BuscarPedidoPorNumero = jest.fn().mockResolvedValue(pedidoEncontradoMock);

		const updatedPedido = await PedidoUseCases.AlterarStatusPagamentoPedido(
			pedidoRepository,
			produtoRepository,
			numeroPedido,
			statusPagamento
		);

		expect(pedidoRepository.BuscarPedidoPorNumero).toHaveBeenCalledWith(numeroPedido);

		//expect(pedidoRepository.EditarPedido).toHaveBeenCalledWith(expect.anything(pedidoProps));

		expect(updatedPedido).toBeDefined();
		expect(updatedPedido.statusPagamento).toBe(statusPagamento);

		if (updatedPedido.statusPagamento === StatusPagamentoEnum.NEGADO) {
			expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
		} else if (updatedPedido.statusPagamento === StatusPagamentoEnum.APROVADO) {
			expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
		}
	});

	test('Ao alterar o status do pagamento do pedido, Status de pedido inválido', async () => {
		const pedidoEncontradoMock = {
			id: '1',
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const numeroPedido = 123456789;

		pedidoRepository.BuscarPedidoPorNumero = jest.fn().mockResolvedValue(pedidoEncontradoMock);

		try {
			await PedidoUseCases.AlterarStatusPagamentoPedido(
				pedidoRepository,
				produtoRepository,
				numeroPedido,
				'statusPagamento' as any
			);
		} catch (error: any) {
			expect(error.message).toBe('Status de pedido inválido');
		}
	});

	test('Ao alterar o status do pagamento do pedido, Pedido não encontrado', async () => {
		try {
			await PedidoUseCases.AlterarStatusPagamentoPedido(
				pedidoRepository,
				produtoRepository,
				123,
				StatusPagamentoEnum.APROVADO
			);
		} catch (error: any) {
			expect(error.message).toBe('Pedido não encontrado');
		}
	});

});
