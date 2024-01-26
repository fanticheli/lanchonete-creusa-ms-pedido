import { CategoriaEnum } from "../../common/enum/categoria-enum";

export type ProdutoProps = {
    id?: string;
    descricao: string;
    valor: number;
    categoria: CategoriaEnum;
}