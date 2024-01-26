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

    test('Create a new Produto, with error Descrição inválida', () => {
        const produtoProps: ProdutoProps = {
            id: '1',
            descricao: '',
            valor: 10,
            categoria: CategoriaEnum.LANCHE
        }

        expect(produtoProps).toBeDefined();

        try {
            new Produto(produtoProps);
        } catch (error: any) {
            expect(error.message).toBe('Descrição inválida');
        }

    })

    test('Create a new Produto, with error Valor inválido', () => {
        const produtoProps: ProdutoProps = {
            id: '1',
            descricao: 'Teste',
            valor: null as any,
            categoria: CategoriaEnum.LANCHE
        }

        try {
            new Produto(produtoProps);
        } catch (error: any) {
            expect(error.message).toBe('Valor inválido');
        }

    })
});