import express, { Request, Response } from "express";
import { ProdutoRepositoryInMongo } from "../../external/mongo/repositories/produto.repository";
import { ProdutoController } from "../../controllers/produto.controller";

const router = express.Router();
const produtoRepositoryInMongo = new ProdutoRepositoryInMongo();

/**
 * @swagger
 * tags:
 *   name: Produto
 */

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto.
 *     tags: [Produto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               valor:
 *                 type: number
 *               categoria:
 *                 type: string
 *             example:
 *               descricao: Sorvetinho
 *               valor: 1.50
 *               categoria: sobremesa
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 */
router.post("/", async (req: Request, res: Response) => {
	await ProdutoController.CriarProduto(produtoRepositoryInMongo, req.body)
		.then((response: any) => {
			res.status(201).send(response);
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /api/produtos/descricao/{descricao}:
 *   get:
 *     summary: Lista produto por descricao
 *     tags: [Produto]
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descricao do produto a ser retornado.
 *     description: Retorna produto com a descricao informada.
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
router.get("/descricao/:descricao", async (req, res) => {
	res.setHeader("Content-type", "application/json");
	res.json(
		await ProdutoController.BuscarProdutoPorDescricao(
			produtoRepositoryInMongo,
			req.params.descricao
		)
	);
});

/**
 * @swagger
 * /api/produtos/categoria/{categoria}:
 *   get:
 *     summary: Lista produto por categoria
 *     tags: [Produto]
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Categoria do produto a ser retornado.
 *     description: Retorna produto com a categoria informada.
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
router.get("/categoria/:categoria", async (req, res) => {
	res.setHeader("Content-type", "application/json");
	res.json(
		await ProdutoController.BuscarProdutoPorCategoria(
			produtoRepositoryInMongo,
			req.params.categoria
		)
	);
});

/**
 * @swagger
 * /api/produtos:
 *   put:
 *     summary: Edita um produto.
 *     tags: [Produto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               descricao:
 *                 type: string
 *               valor:
 *                 type: number
 *               categoria:
 *                 type: string
 *             example:
 *               id: ID do produto criado no POST
 *               descricao: Sorvetinho
 *               valor: 1.50
 *               categoria: sobremesa
 *     responses:
 *       204:
 *         description: Produto editado com sucesso.
 */
router.put("/", async (req: Request, res: Response) => {
	await ProdutoController.EditarProduto(produtoRepositoryInMongo, req.body)
		.then((response: any) => {
			res.status(204).send(response);
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Deleta produto por id
 *     tags: [Produto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do produto a ser deletado.
 *     description: Deleta produto com o id informado.
 *     responses:
 *       201:
 *         description: Produto encontrado
 */
router.delete("/:id", async (req: Request, res: Response) => {
	await ProdutoController.DeletarProduto(
		produtoRepositoryInMongo,
		req.params.id
	)
		.then((response: any) => {
			res.status(201).send(response);
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

module.exports = router;
