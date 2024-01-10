import { StatusPagamentoEnum } from "../common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";

export interface PedidoOutput {
    id?: string;
    produtos: string[];
    valorTotal: number;
    numeroPedido: number;
    cliente: string;
    statusPagamento: StatusPagamentoEnum;
    statusPedido: StatusPedidoEnum;
}