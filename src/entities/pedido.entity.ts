import { StatusPagamentoEnum } from "../common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";
import { PedidoProps } from "./props/pedido.props";

export class Pedido {
	private _id?: string | undefined;
	private _produtos: string[];
	private _valorTotal: number;
	private _numeroPedido: number;
	private _cliente: string;
	private _statusPagamento: StatusPagamentoEnum;
	private _statusPedido: StatusPedidoEnum;

	constructor(pedidoProps: PedidoProps) {
		this._id = pedidoProps.id || undefined;
		this._produtos = pedidoProps.produtos || [];
		this._valorTotal = pedidoProps.valorTotal || 0;
		this._numeroPedido = pedidoProps.numeroPedido || 0;
		this._cliente = pedidoProps.cliente;
		this._statusPagamento =
			pedidoProps.statusPagamento || StatusPagamentoEnum.PENDENTE;
		this._statusPedido =
			pedidoProps.statusPedido || StatusPedidoEnum.RECEBIDO;
	}

	get id(): string | undefined {
		return this._id;
	}

	get produtos(): string[] {
		return this._produtos;
	}

	get valorTotal(): number {
		return this._valorTotal;
	}

	get numeroPedido(): number {
		return this._numeroPedido;
	}

	get cliente(): string {
		return this._cliente;
	}

	get statusPagamento(): StatusPagamentoEnum {
		return this._statusPagamento;
	}

	get statusPedido(): StatusPedidoEnum {
		return this._statusPedido;
	}

	get object() {
		return {
			id: this._id,
			produtos: this._produtos,
			valorTotal: this._valorTotal,
			numeroPedido: this._numeroPedido,
			cliente: this._cliente,
			statusPagamento: this._statusPagamento,
			statusPedido: this._statusPedido,
		};
	}

	set id(id: string) {
		this._id = id;
	}

	set statusPagamento(statusPagamento: StatusPagamentoEnum) {
		this._statusPagamento = statusPagamento;
	}

    set statusPedido(statusPedido: StatusPedidoEnum) {
        this._statusPedido = statusPedido;
    }

	set valorTotal(valorTotal: number) {
		this._valorTotal = valorTotal;
	}

	set numeroPedido(numeroPedido: number) {
		this._numeroPedido = numeroPedido;
	}

	aprovarPagamento() {
		this._statusPagamento = StatusPagamentoEnum.APROVADO;
	}

	negarPagamento() {
		this._statusPagamento = StatusPagamentoEnum.NEGADO;
	}
	
}
