import { PedidoOutput } from "../../adapters/pedido";
import { PedidoProps } from "../../entities/props/pedido.props";

export interface IPedidoGateway {
    CriarPedido(pedidoProps: PedidoProps): Promise<PedidoOutput>;
    NumeroNovoPedido(): Promise<number>;
}