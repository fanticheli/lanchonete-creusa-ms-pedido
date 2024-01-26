import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { Pedido } from "../../src/entities/pedido.entity";
import { PedidoProps } from "../../src/entities/props/pedido.props";

describe("Pedido", () => {
	it("should be defined", () => {
		expect(true).toBeDefined();
	});

	it("Create a new Pedido", () => {
		const pedidoProps: PedidoProps = {
      id: "01",
			produtos: ["1"],
			cliente: "Cliente 1",
			valorTotal: 0,
			numeroPedido: 0,
			statusPagamento: StatusPagamentoEnum.PENDENTE,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const pedido = new Pedido(pedidoProps);
		expect(pedido).toBeInstanceOf(Pedido);
		expect(pedido.id).toBe("01");
		expect(pedido.produtos.length).toBe(1);
		expect(pedido.cliente).toBe("Cliente 1");
	});
});
