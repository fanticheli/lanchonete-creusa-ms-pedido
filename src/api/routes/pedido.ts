import express, { Request, Response } from "express";
import { PedidoController } from "../../controllers/pedido.controller";
import { PedidoRepositoryInMongo } from "../../external/mongo/repositories/pedido.repository";
import { ProdutoRepositoryInMongo } from "../../external/mongo/repositories/produto.repository";

const router = express.Router();
const pedidoRepositoryInMongo = new PedidoRepositoryInMongo();
const produtoRepositoryInMongo = new ProdutoRepositoryInMongo();

/**
 * @swagger
 * tags:
 *   name: Pedido
 */

/**
 * @swagger
 * /api/pedidos/checkout:
 *   post:
 *     summary: Cria um novo pedido.
 *     tags: [Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produtos:
 *                 type: string[]
 *               cliente:
 *                 type: string
 *             example:
 *               produtos: [ID_PRODUTO_1, ID_PRODUTO_2]
 *               cliente: "ID_CLIENTE ou NOME_CLIENTE"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 */
router.post("/checkout", async (req: Request, res: Response) => {
	return await PedidoController.CriarPedido(
		pedidoRepositoryInMongo,
		produtoRepositoryInMongo,
		req.body
	)
		.then((response: any) => {
			return res.status(201).send(response);
		})
		.catch((err: any) => {
			return res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /api/pedidos/status-pagamento/{numeroPedido}:
 *   put:
 *     summary: Altera status de pagamento do pedido por numero do pedido.
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         description: Numero do pedido a ser alterado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusPagamento:
 *                 type: string
 *             example:
 *               statusPagamento: "aprovado"
 *     responses:
 *       200:
 *         description: Status de pagamento do pedido alterado com sucesso.
 */
router.put("/status-pagamento/:numeroPedido", async (req: Request, res: Response) => {
	const statusPagamento = req.body.statusPagamento;

	return await PedidoController.AlterarStatusPagamentoPedido(
		pedidoRepositoryInMongo,
		produtoRepositoryInMongo,
		+req.params.numeroPedido,
		statusPagamento
	)
		.then((response: any) => {
			return res.status(200).send({ statusPagamento: response.statusPagamento });
		})
		.catch((err: any) => {
			return res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /api/pedidos/{id}/status-pedido:
 *   put:
 *     summary: Altera status do pedido do pedido por id
 *     tags: [Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser alterado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusPedido:
 *                 type: string
 *             example:
 *               statusPedido: "Em preparação"
 *     responses:
 *       200:
 *         description: Status do pedido do pedido alterado com sucesso.
 */
router.put("/:id/status-pedido", async (req: Request, res: Response) => {
	const statusPedido = req.body.statusPedido;

	return await PedidoController.AlterarStatusPedido(
		pedidoRepositoryInMongo,
		req.params.id,
		statusPedido
	)
		.then((response: any) => {
			return res.status(200).send({ statusPedido: response.statusPedido });
		})
		.catch((err: any) => {
			return res.status(400).send({ message: err?.message });
		});
});

module.exports = router;
