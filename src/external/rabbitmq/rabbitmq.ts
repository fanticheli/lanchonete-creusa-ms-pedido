import amqp from 'amqplib';
import { IPedidoGateway } from '../../interfaces/gateway/pedido.gateway.interface';
import { IProdutoGateway } from '../../interfaces/gateway/produto.gateway.interface';
import { StatusPagamentoEnum } from '../../common/enum/status-pagamento-enum';
import { PedidoOutput } from '../../adapters/pedido';
import { PedidoUseCases } from '../../usecases/pedido';
import { PedidoRepositoryInMongo } from '../mongo/repositories/pedido.repository';
import { ProdutoRepositoryInMongo } from '../mongo/repositories/produto.repository';
import { StatusPedidoEnum } from '../../common/enum/status-pedido-enum';

export class RabbitMQManager {

    private pedidoRepositoryInMongo = new PedidoRepositoryInMongo();
    private produtoRepositoryInMongo = new ProdutoRepositoryInMongo();

    constructor() { }

    async consumerQueuePagamentos() {
        try {
            const queueName = process.env.QUEUE_PAGAMENTOS_NAME || '';
            const connection = await amqp.connect(process.env.QUEUE_HOST || '');
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });
            channel.consume(queueName, (msg) => {
                if (msg !== null) {

                    const { numeroPedido, statusPagamento } = JSON.parse(msg.content.toString());

                    RabbitMQManager.AlterarStatusPagamentoPedido(
                        this.pedidoRepositoryInMongo,
                        this.produtoRepositoryInMongo,
                        numeroPedido,
                        statusPagamento)
                        .then(() => {
                            channel.ack(msg);
                        })
                        .catch((error) => {
                            console.error('Erro ao criar pagamento:', error);
                        });
                }
            });

        } catch (error) {
            console.error('Erro ao criar consumidor:', error);
        }
    }

    async consumerQueuePedidosProntos() {
        try {
            const queueName = process.env.QUEUE_PRONTOS_NAME || '';
            const connection = await amqp.connect(process.env.QUEUE_HOST || '');
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });
            channel.consume(queueName, (msg) => {
                if (msg !== null) {

                    const { idPedido, statusPedido } = JSON.parse(msg.content.toString());

                    RabbitMQManager.AlterarStatusPedido(
                        this.pedidoRepositoryInMongo,
                        idPedido,
                        statusPedido)
                        .then(() => {
                            channel.ack(msg);
                        })
                        .catch((error) => {
                            console.error('Erro ao criar pagamento:', error);
                        });
                }
            });

        } catch (error) {
            console.error('Erro ao criar consumidor:', error);
        }
    }

    static async AlterarStatusPagamentoPedido(
        pedidoGatewayInterface: IPedidoGateway,
        produtoGatewayInterface: IProdutoGateway,
        numeroPedido: number,
        statusPagamento: StatusPagamentoEnum
    ): Promise<PedidoOutput | null> {
        try {
            return await PedidoUseCases.AlterarStatusPagamentoPedido(
                pedidoGatewayInterface,
                produtoGatewayInterface,
                numeroPedido,
                statusPagamento
            );
        } catch (error) {
            throw error;
        }
    }

    static async AlterarStatusPedido(
		pedidoGatewayInterface: IPedidoGateway,
		pedidoID: string,
		statusPedido: StatusPedidoEnum
	): Promise<PedidoOutput | null> {
		try {
			return await PedidoUseCases.AlterarStatusPedido(
				pedidoGatewayInterface,
				pedidoID,
				statusPedido
			);
		} catch (error) {
			throw error;
		}
	}
}