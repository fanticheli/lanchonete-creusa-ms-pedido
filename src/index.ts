const dotenv = require("dotenv");
dotenv.config();

import { LanchoneteCreusa } from "./api";
import { MongoConnection } from "./external/mongo/mongo";

MongoConnection.start()
const lanchoneteCreusa = new LanchoneteCreusa();
lanchoneteCreusa.start();
