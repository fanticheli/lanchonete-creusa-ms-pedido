import { ProdutoOutput } from "../adapters/produto";
import { ProdutoProps } from "../entities/props/produto.props";
import { IProdutoGateway } from "../interfaces/gateway/produto.gateway.interface";
import { ProdutoUseCases } from "../usecases/produtos";

export class ProdutoController {
	static async CriarProduto(
		produtoGatewayInterface: IProdutoGateway,
		produtoProps: ProdutoProps
	): Promise<ProdutoOutput> {
		try {
			return await ProdutoUseCases.CriarProduto(
				produtoGatewayInterface,
				produtoProps
			);
		} catch (error) {
			throw error;
		}
	}

	static async BuscarProdutoPorDescricao(
		produtoGatewayInterface: IProdutoGateway,
		descricao: string
	): Promise<ProdutoOutput | null> {
		try {
			return await ProdutoUseCases.BuscarProdutoPorDescricao(
				produtoGatewayInterface,
				descricao
			);
		} catch (error) {
			throw error;
		}
	}

	static async BuscarProdutoPorCategoria(
		produtoGatewayInterface: IProdutoGateway,
		categoria: string
	): Promise<ProdutoOutput[]> {
		try {
			return await ProdutoUseCases.BuscarProdutoPorCategoria(
				produtoGatewayInterface,
				categoria
			);
		} catch (error) {
			throw error;
		}
	}

	static async EditarProduto(
		produtoGatewayInterface: IProdutoGateway,
		produtoProps: ProdutoProps
	): Promise<ProdutoOutput> {
		try {
			return await ProdutoUseCases.EditarProduto(
				produtoGatewayInterface,
				produtoProps
			);
		} catch (error) {
			throw error;
		}
	}

	static async DeletarProduto(
		produtoGatewayInterface: IProdutoGateway,
		produtoID: string
	): Promise<boolean> {
		try {
			await ProdutoUseCases.DeletarProduto(
				produtoGatewayInterface,
				produtoID
			);

			return true;
		} catch (error) {
			throw error;
		}
	}
}
