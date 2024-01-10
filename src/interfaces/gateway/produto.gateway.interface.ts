import { ProdutoOutput } from "../../adapters/produto";
import { ProdutoProps } from "../../entities/props/produto.props";

export interface IProdutoGateway {
    CriarProduto(produtoProps: ProdutoProps): Promise<ProdutoOutput>;
    BuscarProdutoPorDescricao(descricao: string): Promise<ProdutoOutput | null>;
    BuscarProdutoPorCategoria(categoria: string): Promise<ProdutoOutput[]>;
    BuscarProdutoPorID(produtoID: string): Promise<ProdutoOutput | null>;
    EditarProduto(produtoProps: ProdutoProps): Promise<ProdutoOutput>;
    DeletarProduto(produtoID: string): Promise<void>;
}