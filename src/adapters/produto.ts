import { CategoriaEnum } from "../common/enum/categoria-enum";
import { Produto } from "../entities/produto.entity";

export interface ProdutoOutput {
	id?: string;
	descricao: string;
	valor: number;
	categoria: CategoriaEnum;
}

export const ProdutoAdapter = {
	adaptJsonProdutos: function (
		produtos: Produto[]
	): ProdutoOutput[] {
		return produtos.map(function (item) {
			return {
				id: item.id,
				descricao: item.descricao,
				valor: item.valor,
				categoria: item.categoria,
			};
		});
	},
	adaptJsonProduto: function (produto: Produto): ProdutoOutput {
		return {
			id: produto.id,
			descricao: produto.descricao,
			valor: produto.valor,
			categoria: produto.categoria,
		};
	},
};
