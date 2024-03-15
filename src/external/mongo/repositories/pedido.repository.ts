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

	async BuscarPedidoPorID(pedidoID: string): Promise<PedidoOutput | null> {
		if (!ObjectId.isValid(pedidoID)) {
			throw new Error("ID inválido");
		}

		const pedidoEncontrado = await this._model.findById(pedidoID);

		if (!pedidoEncontrado) {
			return null;
		}

		return pedidoEncontrado;
	}

	async BuscarPedidoPorNumero(numeroPedido: number): Promise<PedidoOutput | null> {
		if (!numeroPedido) {
			throw new Error("Numero do pedido inválido");
		}

		const pedidoEncontrado = await this._model.findOne({ numeroPedido });

		if (!pedidoEncontrado) {
			return null;
		}

		return pedidoEncontrado;
	}

	async EditarPedido(pedidoEditar: PedidoProps): Promise<PedidoOutput> {
		if (!pedidoEditar.id || !ObjectId.isValid(pedidoEditar.id)) {
			throw new Error("ID inválido");
		}

		return this._model.findByIdAndUpdate(pedidoEditar.id, pedidoEditar, {
			new: true,
		});
	}
}
