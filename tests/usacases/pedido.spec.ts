import axios, { AxiosResponse } from "axios";
import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { PedidoProps } from "../../src/entities/props/pedido.props";
import { ProdutoProps } from "../../src/entities/props/produto.props";
import { PedidoRepositoryInMemory } from "../../src/external/memory/pedido.repository";
import { ProdutoRepositoryInMemory } from "../../src/external/memory/produto.repository";
import { PedidoUseCases } from "../../src/usecases/pedido";
import { ProdutoUseCases } from "../../src/usecases/produtos";
import { PedidoOutput } from "../../src/adapters/pedido";
import exp from "constants";

jest.mock('axios');

describe("Pedido", () => {
	let produtoRepository = new ProdutoRepositoryInMemory();
	let pedidoRepository = new PedidoRepositoryInMemory();

	beforeEach(() => {
		process.env.URL_MS_PAGAMENTO = 'http://localhost:0000/api/pagamentos'
		produtoRepository = new ProdutoRepositoryInMemory();
		pedidoRepository = new PedidoRepositoryInMemory();
		jest.clearAllMocks();
	});

	test("Deve criar um pedido", async () => {
		const mockResponse = {
			data: {
				codigoPix: "123456789",
			},
		};

		(axios.post as jest.Mock).mockImplementation(() => Promise.resolve(mockResponse));

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
		process.env.URL_MS_PAGAMENTO = ''

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

		(axios.post as jest.Mock).mockImplementation(() => Promise.resolve(mockResponse));

		const pedidoProps: PedidoProps = {
			produtos: ['1'],
			cliente: 'Cliente 1',
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const novoPagamento = await PedidoUseCases.CriarPagamento(pedidoProps);

		expect(novoPagamento).toBeDefined();
	});

	test('Deve alterar o status do pagamento do pedido APROVADO', async () => {
		const pedidoEncontradoMock = {
			id: '1',
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};


		const codigoPagamento = '123456789';
		const statusPagamento = StatusPagamentoEnum.APROVADO;

		pedidoRepository.BuscarPedidoPorCodigoPagamento = jest.fn().mockResolvedValue(pedidoEncontradoMock);

		const updatedPedido = await PedidoUseCases.AlterarStatusPagamentoPedido(
			pedidoRepository,
			codigoPagamento,
			statusPagamento
		);

		expect(pedidoRepository.BuscarPedidoPorCodigoPagamento).toHaveBeenCalledWith(codigoPagamento);

		//expect(pedidoRepository.EditarPedido).toHaveBeenCalledWith(expect.anything(pedidoProps));

		expect(updatedPedido).toBeDefined();
		expect(updatedPedido.statusPagamento).toBe(statusPagamento);

		if (updatedPedido.statusPagamento === StatusPagamentoEnum.NEGADO) {
			expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
		} else if (updatedPedido.statusPagamento === StatusPagamentoEnum.APROVADO) {
			expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
		}
	});

	test('Deve alterar o status do pagamento do pedido NEGADO', async () => {
		const pedidoEncontradoMock = {
			id: '1',
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};


		const codigoPagamento = '123456789';
		const statusPagamento = StatusPagamentoEnum.NEGADO;

		pedidoRepository.BuscarPedidoPorCodigoPagamento = jest.fn().mockResolvedValue(pedidoEncontradoMock);

		const updatedPedido = await PedidoUseCases.AlterarStatusPagamentoPedido(
			pedidoRepository,
			codigoPagamento,
			statusPagamento
		);

		expect(pedidoRepository.BuscarPedidoPorCodigoPagamento).toHaveBeenCalledWith(codigoPagamento);

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

		const codigoPagamento = '123456789';

		pedidoRepository.BuscarPedidoPorCodigoPagamento = jest.fn().mockResolvedValue(pedidoEncontradoMock);

		try {
			await PedidoUseCases.AlterarStatusPagamentoPedido(
				pedidoRepository,
				codigoPagamento,
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
				'codigoPagamento',
				StatusPagamentoEnum.APROVADO
			);
		} catch (error: any) {
			expect(error.message).toBe('Pedido não encontrado');
		}
	});

});
