import { ObjectId } from "mongodb";
import { PedidoOutput } from "../../../adapters/pedido";
import { PedidoProps } from "../../../entities/props/pedido.props";
import { IPedidoGateway } from "../../../interfaces/gateway/pedido.gateway.interface";
import { PedidoMongo } from "../model/pedido";
import { StatusPedidoEnum } from "../../../common/enum/status-pedido-enum";

export class PedidoRepositoryInMongo implements IPedidoGateway {
	private _model;

	constructor() {
		this._model = PedidoMongo;
	}

	async CriarPedido(pedidoProps: PedidoProps): Promise<PedidoOutput> {
		return this._model.create(pedidoProps);
	}

	async NumeroNovoPedido(): Promise<number> {
		const quantidadePedidos = await this._model.countDocuments();
		return quantidadePedidos + 1;
	}
}
