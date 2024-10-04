import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './config/database.js';

// Importar as rotas
import usuarioRoutes from './routes/usuario.js';
import categoriaRoutes from './routes/categoria.js';
import receitaRoutes from './routes/receita.js';
import cartaoRoutes from './routes/cartao.js';
import compraRoutes from './routes/compra.js';

// Conectar ao MongoDB
connectDB();

// Inicializar o aplicativo Express
const app = express();

// Middleware para analisar JSON no corpo das requisições
app.use(bodyParser.json());

// Usar as rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/receitas', receitaRoutes);
app.use('/api/cartoes', cartaoRoutes);
app.use('/api/compras', compraRoutes);

// Definir a porta e iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
