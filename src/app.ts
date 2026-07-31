import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { openApiDocument } from "./docs/openapi";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use(
    '/docs',
    apiReference({
        content: openApiDocument,
    }),
);

app.use('/api', routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;