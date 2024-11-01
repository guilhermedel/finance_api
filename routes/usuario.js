// routes/usuarios.js
import express from "express";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();
const SECRET_KEY = "sua_chave_secreta_jwt"; // Em produção, use variáveis de ambiente

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relacionadas a usuários
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "usuario@example.com"
 *         senha:
 *           type: string
 *           description: Senha do usuário (criptografada)
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João da Silva"
 *       example:
 *         id: "60d0fe4f5311236168a109ca"
 *         email: "usuario@example.com"
 *         senha: "$2a$10$EixZaYVK1fsbw1ZfbX3OXe.PX5W6M6uQ3mGq9bZ6e1zYxF5jZxJ5e"
 *         nome: "João da Silva"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login realizado com sucesso"
 *         response:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Token JWT para autenticação
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             id:
 *               type: string
 *               description: ID do usuário
 *               example: "60d0fe4f5311236168a109ca"
 *             email:
 *               type: string
 *               format: email
 *               example: "usuario@example.com"
 *             nome:
 *               type: string
 *               example: "João da Silva"
 *     RegistroResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuário registrado com sucesso"
 *         response:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Token JWT para autenticação
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             id:
 *               type: string
 *               description: ID do usuário
 *               example: "60d0fe4f5311236168a109cb"
 *             email:
 *               type: string
 *               format: email
 *               example: "novo@usuario.com"
 *             nome:
 *               type: string
 *               example: "Maria Oliveira"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Erro no servidor"
 *         message:
 *           type: string
 *           description: Mensagem adicional de erro
 *           example: "Usuário não encontrado"
 */

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email ou senha inválidos"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Login de usuário
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login realizado com sucesso",
      response: {
        token: token,
        id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /usuarios/registro:
 *   post:
 *     summary: Registro de um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *               - nome
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novo@usuario.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *               nome:
 *                 type: string
 *                 example: "Maria Oliveira"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email já cadastrado"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar um novo usuário (Registro)
router.post("/registro", async (req, res) => {
  try {
    const { email, senha, nome } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      email,
      senha: senhaCriptografada,
      nome,
    });

    await novoUsuario.save();

    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      response: {
        token: token,
        id: novoUsuario._id,
        email: novoUsuario.email,
        nome: novoUsuario.nome,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotas protegidas abaixo (requerem autenticação)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuários encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuários encontrados com sucesso"
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todos os usuários
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.json({
      message: "Usuários encontrados com sucesso",
      response: usuarios,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário encontrado com sucesso"
 *                 response:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter um usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senha");
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json({
      message: "Usuário encontrado com sucesso",
      response: usuario,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "atualizado@usuario.com"
 *               senha:
 *                 type: string
 *                 example: "novaSenha123"
 *               nome:
 *                 type: string
 *                 example: "Maria Atualizada"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário atualizado com sucesso"
 *                 response:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Atualizar um usuário por ID
router.put("/:id", async (req, res) => {
  try {
    if (req.body.senha) {
      const salt = await bcrypt.genSalt(10);
      req.body.senha = await bcrypt.hash(req.body.senha, salt);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).select("-senha");

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json({
      message: "Usuário atualizado com sucesso",
      response: usuarioAtualizado,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário deletado com sucesso"
 *                 response:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Deletar um usuário por ID
router.delete("/:id", async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json({
      message: "Usuário deletado com sucesso",
      response: usuarioDeletado,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
