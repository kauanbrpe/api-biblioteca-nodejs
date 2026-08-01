import { createDocument } from "zod-openapi";
import { authorPaths } from "./paths/author.paths";
import { bookPaths } from "./paths/book.paths";
import { loanPaths } from "./paths/loan.paths";
import { notificationPaths } from "./paths/notification.paths";
import { reviewPaths } from "./paths/review.paths";
import { userPaths } from "./paths/user.paths";

export const openApiDocument = createDocument({
    openapi: "3.1.0",
    info: {
        title: "API Biblioteca",
        version: "1.0.0",
        description: "API para gerenciamento de biblioteca — autores, livros, empréstimos, avaliações e notificações.",
    },
    servers: [
    { url: "http://localhost:3000/api", description: "Desenvolvimento local" },
    { url: "https://api-biblioteca-nodejs.onrender.com/api", description: "Produção" },
],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    paths: {
        ...authorPaths,
        ...bookPaths,
        ...loanPaths,
        ...notificationPaths,
        ...reviewPaths,
        ...userPaths,
    },
});