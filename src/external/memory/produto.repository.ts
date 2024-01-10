import { ProdutoAdapter, ProdutoOutput } from "../../adapters/produto";
import { Produto } from "../../entities/produto.entity";
import { ProdutoProps } from "../../entities/props/produto.props";
import { IProdutoGateway } from "../../interfaces/gateway/produto.gateway.interface";

export class ProdutoRepositoryInMemory implements IProdutoGateway {
	private produtos: Produto[] = [];

	async CriarProduto(produtoProps: ProdutoProps): Promise<ProdutoOutput> {
		const produto = new Produto(produtoProps);
		this.produtos.push(produto);
		return ProdutoAdapter.adaptJsonProduto(produto);
	}

	async BuscarProdutoPorDescricao(
		descricao: string
	): Promise<ProdutoOutput | null> {
		const produtoExistente = this.produtos.find(
			(produto) => produto.descricao === descricao
		);

		if (!produtoExistente) {
			return null;
		}

		return ProdutoAdapter.adaptJsonProduto(produtoExistente);
	}

	async BuscarProdutoPorCategoria(
		categoria: string
	): Promise<ProdutoOutput[]> {
		const protudosEncontrados = this.produtos.filter(
			(produto) => produto.categoria === categoria
		);
		return ProdutoAdapter.adaptJsonProdutos(protudosEncontrados);
	}

	async EditarProduto(
		editarProdutoDTO: ProdutoProps
	): Promise<ProdutoOutput> {
		if (!editarProdutoDTO.id) {
			throw new Error("ID do produto não informado");
		}

		this.produtos.map((produto) => {
			if (produto.id === editarProdutoDTO.id) {
				produto.descricao = editarProdutoDTO.descricao;
				produto.categoria = editarProdutoDTO.categoria;
				produto.valor = editarProdutoDTO.valor;
			}
		});

		return this.BuscarProdutoPorID(editarProdutoDTO.id);
	}

	async BuscarProdutoPorID(id: string): Promise<ProdutoOutput> {
		const produto = this.produtos.find((produto) => produto.id === id);

		if (!produto) {
			throw new Error("Produto não encontrado");
		}

		return ProdutoAdapter.adaptJsonProduto(produto);
	}

	async DeletarProduto(produtoID: string): Promise<void> {
		this.produtos = this.produtos.filter((produto) => produto.id !== produtoID);
	}
}
