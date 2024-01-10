const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
	{
		produtos: [String],
		cliente: String,
		valorTotal: Number,
		numeroPedido: Number,
		statusPagamento: String,
		statusPedido: String,
	},
	{
		timestamps: true,
	}
);

export const PedidoMongo = mongoose.model("Pedido", PedidoSchema);
