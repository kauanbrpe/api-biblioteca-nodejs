import express from "express";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(requestLogger);

// app.use('/api', routes); // TODO: descomentar quando as rotas forem criadas

app.use(notFoundHandler);

app.use(errorHandler);

export default app;