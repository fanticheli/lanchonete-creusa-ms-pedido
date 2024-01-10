import { StatusPagamentoEnum } from "../../common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../common/enum/status-pedido-enum";

export type PedidoProps = {
    id?: string;
    produtos: string[];
    cliente: string;
    valorTotal: number;
    numeroPedido: number;
    statusPagamento: StatusPagamentoEnum;
    statusPedido: StatusPedidoEnum;
};