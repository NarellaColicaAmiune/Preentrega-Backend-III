import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
        title: "My API",
        version: "1.0.0",
        description: "API documentation for my application",
    },
},
  apis: [path.join(__dirname, "../routes/*.js")]
};

export function setupSwagger(app) {
    const swaggerSpec = swaggerJSDoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }