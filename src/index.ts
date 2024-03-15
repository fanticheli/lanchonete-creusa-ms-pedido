const dotenv = require("dotenv");
dotenv.config();

import { LanchoneteCreusa } from "./api";
import { MongoConnection } from "./external/mongo/mongo";
import { RabbitMQManager } from "./external/rabbitmq/rabbitmq";

MongoConnection.start()
const lanchoneteCreusa = new LanchoneteCreusa();
lanchoneteCreusa.start();

const rabbitMQManager = new RabbitMQManager();
rabbitMQManager.consumerQueuePagamentos();
rabbitMQManager.consumerQueuePedidosProntos();
