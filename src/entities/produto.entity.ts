import { ProdutoProps } from "./props/produto.props";
import { CategoriaEnum } from "../common/enum/categoria-enum";

export class Produto {
	private _id?: string;
	private _descricao: string;
	private _valor: number;
	private _categoria: CategoriaEnum;

	constructor(produtoProps: ProdutoProps) {
		if (produtoProps.id) {
			this._id = produtoProps.id;
		}

		if (!this.validarDescricao(produtoProps.descricao)) {
			throw new Error("Descrição inválida");
		}

		if (!this.validarValor(produtoProps.valor)) {
			throw new Error("Valor inválido");
		}

		if (!this.validarCategoria(produtoProps.categoria)) {
			throw new Error("Categoria inválida");
		}

		this._descricao = produtoProps.descricao;
		this._valor = produtoProps.valor;
		this._categoria = produtoProps.categoria;
	}

	get id(): string | undefined {
		return this._id;
	}

	get descricao(): string {
		return this._descricao;
	}

	get valor(): number {
		return this._valor;
	}

	get categoria(): CategoriaEnum {
		return this._categoria;
	}

	get object(): ProdutoProps {
		return {
			id: this._id,
			descricao: this._descricao,
			valor: this._valor,
			categoria: this._categoria,
		};
	}

	set descricao(descricao: string) {
		if (!this.validarDescricao(descricao)) {
			throw new Error("Descrição inválida");
		}

		this._descricao = descricao;
	}

	set valor(valor: number) {
		if (!this.validarValor(valor)) {
			throw new Error("Valor inválido");
		}

		this._valor = valor;
	}

	set categoria(categoria: CategoriaEnum) {
		if (!this.validarCategoria(categoria)) {
			throw new Error("Categoria inválida");
		}

		this._categoria = categoria;
	}

	validarDescricao(descricao: string): boolean {
		if (descricao?.length > 0) {
			return true;
		}

		return false;
	}

	validarValor(valor: number): boolean {
		if (valor > 0) {
			return true;
		}

		return false;
	}

	validarCategoria(categoria: CategoriaEnum): boolean {
		return Object.values(CategoriaEnum).includes(categoria);
	}
}
