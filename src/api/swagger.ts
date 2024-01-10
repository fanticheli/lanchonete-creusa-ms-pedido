const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lanchonete creusa API',
      version: '1.0.0',
      description: 'Sistema de pedidos para lanchonetes. Cadastro de clientes, gestão de produtos e acompanhamento em tempo real. Desenvolvido em Nodejs+Express e MongoDB utilizando clean arch. Melhore o atendimento e satisfação dos clientes.',
    }
  },
  apis: ['./src/api/routes/*.ts', './src/api/routes/*.js', './dist/src/api/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
