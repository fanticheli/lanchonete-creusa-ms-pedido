import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { ProdutoProps } from "../../src/entities/props/produto.props";
import { ProdutoRepositoryInMemory } from "../../src/external/memory/produto.repository";
import { ProdutoUseCases } from "../../src/usecases/produtos";

describe("Produto", () => {
	let produtoRepository = new ProdutoRepositoryInMemory();

	beforeEach(() => {	
		produtoRepository = new ProdutoRepositoryInMemory();
	});

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

	test("should create a new productm with erro, same description", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		await ProdutoUseCases.CriarProduto(
			produtoRepository,
			produtoProps
		);

		try {
			await ProdutoUseCases.CriarProduto(
				produtoRepository,
				produtoProps
			);
		} catch (error: any) {
			expect(error.message).toBe('Produto já cadastrado com essa descrição')
		}

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

		await ProdutoUseCases.CriarProduto(
			produtoRepository,
			produtoProps
		);
		
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

	test("should edit a new product, with error ID do produto não informado", async () => {
		const produtoProps: ProdutoProps = {
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		await ProdutoUseCases.CriarProduto(
			produtoRepository,
			produtoProps
		);

		try {
			await ProdutoUseCases.EditarProduto(
				produtoRepository,
				produtoProps
			);
		} catch (error: any) {
			expect(error.message).toBe("ID do produto não informado");
		}
	});

	test("should edit a new product, with error Produto não encontrado", async () => {
		const produtoProps: ProdutoProps = {
			id: "2",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		try {
			await ProdutoUseCases.EditarProduto(
				produtoRepository,
				produtoProps
			);
		} catch (error: any) {
			expect(error.message).toBe("Produto não encontrado");
		}
	});

	test("should delete a product", async () => {
		const produtoProps: ProdutoProps = {
			id: "1",
			descricao: "Produto 1",
			valor: 10,
			categoria: CategoriaEnum.BEBIDA,
		};

		await ProdutoUseCases.CriarProduto(
			produtoRepository,
			produtoProps
		);

		await ProdutoUseCases.DeletarProduto(produtoRepository, "1");

		const produto = await ProdutoUseCases.BuscarProdutoPorDescricao(
			produtoRepository,
			"Produto 1"
		);

		expect(produto).toBeNull();
	})

	test("should delete a product, with error ID do produto não informado", async () => {
		try {
			await ProdutoUseCases.DeletarProduto(produtoRepository, "");	
		} catch (error: any) {
			expect(error.message).toBe("ID do produto não informado");
		}
	})

	test("should delete a product, with error Produto não encontrado", async () => {
		try {
			await ProdutoUseCases.DeletarProduto(produtoRepository, "1");	
		} catch (error: any) {
			expect(error.message).toBe("Produto não encontrado");
		}
	})
});
