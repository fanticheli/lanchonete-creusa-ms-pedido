import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { ProdutoProps } from "../../src/entities/props/produto.props";
import { ProdutoRepositoryInMemory } from "../../src/external/memory/produto.repository";
import { ProdutoUseCases } from "../../src/usecases/produtos";

describe("Produto", () => {
	const produtoRepository = new ProdutoRepositoryInMemory();

	test("should create a new product", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		const novoProduto = await ProdutoUseCases.CriarProduto(
			produtoRepository,
			produtoProps
		);

		expect(novoProduto).toBeDefined();
		expect(novoProduto?.id).toBe("1");
		expect(novoProduto?.descricao).toBe("Produto 1");
		expect(novoProduto?.valor).toBe(10);
		expect(novoProduto?.categoria).toBe(CategoriaEnum.BEBIDA);
	});

	test("should create a new product with same description", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		try {
			await ProdutoUseCases.CriarProduto(produtoRepository, produtoProps);
		} catch (error: any) {
			expect(error.message).toBe(
				"Produto já cadastrado com essa descrição"
			);
		}
	});

	test("get products by category", async () => {
		const produtos = await ProdutoUseCases.BuscarProdutoPorCategoria(
			produtoRepository,
			CategoriaEnum.BEBIDA
		);

		expect(produtos.length).toBe(1);
		expect(produtos[0].id).toBe("1");
		expect(produtos[0].descricao).toBe("Produto 1");
		expect(produtos[0].valor).toBe(10);
		expect(produtos[0].categoria).toBe(CategoriaEnum.BEBIDA);
	})

	test("should edit a new product", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		const produtoEditado = await ProdutoUseCases.EditarProduto(
			produtoRepository,
			produtoProps
		);

		expect(produtoEditado).toBeDefined();
		expect(produtoEditado?.id).toBe("1");
		expect(produtoEditado?.descricao).toBe("Produto 1");
		expect(produtoEditado?.valor).toBe(10);
		expect(produtoEditado?.categoria).toBe(CategoriaEnum.BEBIDA);
	});

	test("should delete a product", async () => {
		await ProdutoUseCases.DeletarProduto(produtoRepository, "1");

		const produto = await ProdutoUseCases.BuscarProdutoPorDescricao(
			produtoRepository,
			"Produto 1"
		);

		expect(produto).toBeNull();
	})
});
