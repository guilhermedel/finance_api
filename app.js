import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/database.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import cors from 'cors';
// Importar as rotas
import usuarioRoutes from "./routes/usuario.js";
import categoriaRoutes from "./routes/categoria.js";
import receitaRoutes from "./routes/receita.js";
import cartaoRoutes from "./routes/cartao.js";
import compraRoutes from "./routes/compra.js";
import contaBancariaRoutes from "./routes/contaBancaria.js";


// Conectar ao MongoDB
await connectDB();

// Inicializar o aplicativo Express
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  app.use(cors());
  next();
});
// Middleware para analisar JSON no corpo das requisições
app.use(bodyParser.json());

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css";
// Usar as rotas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/receitas", receitaRoutes);
app.use("/api/contas",contaBancariaRoutes);
app.use("/api/cartoes", cartaoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec,{customCssUrl:CSS_URL}));

// Definir a porta e iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
