export class LanchoneteCreusa {
	constructor() {}

	start() {
		const express = require("express");

		const app = express();
		const swaggerUi = require("swagger-ui-express");
		const swaggerSpec = require("./swagger");
		app.use(express.json());
		const PORT = process.env.PORT || 3000;

		const docsRoutes = require("./routes/docs");
		const indexRoutes = require("./routes/routes");
		const clienteRoutes = require("./routes/cliente");
		const produtosRoutes = require("./routes/produto");
		const pedidosRoutes = require("./routes/pedido");

		app.use("/api", indexRoutes);
		app.use("/api-json", docsRoutes);
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		app.use("/api/clientes", clienteRoutes);
		app.use("/api/produtos", produtosRoutes);
		app.use("/api/pedidos", pedidosRoutes);

		app.listen(PORT, () => {
			console.log(`Lanchonete da Creusa app listening on port ${PORT}`);
		});
	}
}
