import express, { Request, Response } from "express";
import { ClienteController } from "../../controllers/cliente.controller";
import { ClienteRepositoryInMongo } from "../../external/mongo/repositories/cliente.repository";
import { PedidoRepositoryInMongo } from "../../external/mongo/repositories/pedido.repository";

const router = express.Router();
const clienteRepositoryInMongo = new ClienteRepositoryInMongo();
const pedidoRepositoryInMongo = new PedidoRepositoryInMongo();

/**
 * @swagger
 * tags:
 *   name: Cliente
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Cliente]
 *     description: Retorna todos os clientes cadastrados.
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", async (req, res) => {
	res.setHeader("Content-type", "application/json");
	return res.json(
		await ClienteController.BuscarTodosClientes(clienteRepositoryInMongo)
	);
});

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente.
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *             example:
 *               nome: João
 *               email: joão@joão.com.br
 *               cpf: 360.635.210-70
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.post("/", async (req: Request, res: Response) => {
	return await ClienteController.CriarCliente(clienteRepositoryInMongo, req.body)
		.then((response: any) => {
			return res.status(201).send(response);
		})
		.catch((err: any) => {
			return res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /api/clientes/cpf/{cpf}:
 *   get:
 *     summary: Lista cliente por CPF
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente a ser retornado.
 *     description: Retorna cliente com o CPF informado.
 *     responses:
 *       200:
 *         description: Cliente encontrado
 */
router.get("/cpf/:cpf", async (req, res) => {
	res.setHeader("Content-type", "application/json");
	return res.json(
		await ClienteController.BuscarClientePorCPF(clienteRepositoryInMongo, req.params.cpf)
	);
});

/**
 * @swagger
 * /api/clientes/cpf/{cpf}:
 *   delete:
 *     summary: Deleta cliente por CPF
 *     tags: [Cliente]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente a ser deletado.
 *     description: Deleta cliente com o CPF informado.
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 */
router.delete("/cpf/:cpf", async (req, res) => {
	res.setHeader("Content-type", "application/json");

	const response = await ClienteController.DeletarClientePorCPF(
		clienteRepositoryInMongo,
		pedidoRepositoryInMongo,
		req.params.cpf);

	if (response) {
		return res.json({ message: "Cliente deletado com sucesso" });
	}

	return res.json({ message: "Cliente não deletado" });
});

module.exports = router;
