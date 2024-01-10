import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { Produto } from "../../src/entities/produto.entity";
import { ProdutoProps } from "../../src/entities/props/produto.props";

describe('Produto', () => {
    test('should be defined', () => {
        expect(true).toBeDefined();
    })

    test('Create a new Produto', () => {
        const produtoProps: ProdutoProps = {
            id: '1',
            descricao: 'Produto 1',
            valor: 10,
            categoria: CategoriaEnum.LANCHE
        }

        const produto = new Produto(produtoProps);
        expect(produto).toBeInstanceOf(Produto);
        expect(produto.id).toBe('1');
        expect(produto.descricao).toBe('Produto 1');
        expect(produto.valor).toBe(10);
        expect(produto.categoria).toBe(CategoriaEnum.LANCHE);
    })
});