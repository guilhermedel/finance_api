// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: "1.0.0",
      description: "Descrição da minha API",
    },
    servers: [
      {
        url: "/api/",
      },
    ],
  },
  // Caminhos para os arquivos que contêm as anotações do Swagger
  apis: ["./routes/*.js"], // ajuste conforme a estrutura do seu projeto
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
