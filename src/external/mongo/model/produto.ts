import { CategoriaEnum } from "../../../common/enum/categoria-enum";

const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema(
	{
		descricao: {
            type: String,
            required: true,
            unique: true
        },
        valor: {
            type: Number,
            required: true
        },
        categoria: {
            type: String,
            required: true,
            enum: CategoriaEnum
        }
	},
	{
		timestamps: true,
	}
);

export const ProdutoMongo = mongoose.model("Produto", ProdutoSchema);
