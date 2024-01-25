import axios from "axios";
import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { PedidoProps } from "../../src/entities/props/pedido.props";
import { ProdutoProps } from "../../src/entities/props/produto.props";
import { PedidoRepositoryInMemory } from "../../src/external/memory/pedido.repository";
import { ProdutoRepositoryInMemory } from "../../src/external/memory/produto.repository";
import { PedidoUseCases } from "../../src/usecases/pedido";
import { ProdutoUseCases } from "../../src/usecases/produtos";

jest.unmock('axios'); 

describe("Pedido", () => {
  const produtoRepository = new ProdutoRepositoryInMemory();
  const pedidoRepository = new PedidoRepositoryInMemory();

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('Deve alterar o status do pagamento do pedido', async () => {
    const pedidoEncontradoMock: PedidoOutput = {
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

    expect(pedidoRepository.EditarPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        statusPagamento: StatusPagamentoEnum.APROVADO,
      })
    );

    expect(updatedPedido).toBeDefined();
    expect(updatedPedido.statusPagamento).toBe(statusPagamento);

    if (statusPagamento === StatusPagamentoEnum.NEGADO) {
      expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
    } else if (statusPagamento === StatusPagamentoEnum.APROVADO) {
      expect(updatedPedido.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
    }
  });
});
