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

jest.mock('axios');

describe("Pedido", () => {
	const produtoRepository = new ProdutoRepositoryInMemory();
	const pedidoRepository = new PedidoRepositoryInMemory();

	test("Deve criar um pedido", async () => {
		const mockResponse = {
			data: {
				codigoPix: "123456789",
			},
		};

		axios.post.mockImplementation(() => Promise.resolve(mockResponse));

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
	
	
	test('Deve criar um pagamento', async () => {
		const mockResponse = {
		  data: {
			codigoPix: '987678954',
		  },
		};
	
		axios.post.mockImplementation(() => Promise.resolve(mockResponse));
	
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

	  test('Deve alterar o status do pagamento do pedido', async () => {
		const pedidoEncontradoMock: PedidoOutput = {
		  id: '1',
		  statusPagamento: StatusPagamentoEnum.PENDENTE,
		  statusPedido: StatusPedidoEnum.RECEBIDO,
		};


		const pedidoProps: PedidoProps = {
			produtos: ['1'],
			cliente: 'Cliente 1',
			valorTotal: 0,
			numeroPedido: 0,
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
	
		if (statusPagamento === StatusPagamentoEnum.NEGADO) {
		  expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
		} else if (statusPagamento === StatusPagamentoEnum.APROVADO) {
		  expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
		}
	  });

});
