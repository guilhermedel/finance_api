// routes/cartoes.js
import express from "express";
import Cartao from "../models/Cartao.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cartões
 *   description: Operações relacionadas a cartões
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cartao:
 *       type: object
 *       required:
 *         - numero
 *         - validade
 *         - usuario
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cartão
 *         numero:
 *           type: string
 *           description: Número do cartão
 *           example: "1234-5678-9012-3456"
 *         validade:
 *           type: string
 *           format: date
 *           description: Data de validade do cartão
 *           example: "2025-12-31"
 *         usuario:
 *           type: string
 *           description: ID do usuário associado
 *           example: "60d0fe4f5311236168a109ca"
 *       example:
 *         id: "60d0fe4f5311236168a109cb"
 *         numero: "1234-5678-9012-3456"
 *         validade: "2025-12-31"
 *         usuario: "60d0fe4f5311236168a109ca"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Erro no servidor"
 */

/**
 * @swagger
 * /cartoes:
 *   post:
 *     summary: Cria um novo cartão
 *     tags: [Cartões]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cartao'
 *     responses:
 *       201:
 *         description: Cartão criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cartao'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar um novo cartão
router.post("/", async (req, res) => {
  try {
    const novoCartao = new Cartao(req.body);
    await novoCartao.save();
    res.status(201).json(novoCartao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cartoes:
 *   get:
 *     summary: Retorna uma lista de cartões
 *     tags: [Cartões]
 *     responses:
 *       200:
 *         description: Lista de cartões
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cartao'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todos os cartões
router.get("/", async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate("usuario");
    res.json(cartoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cartoes/{id}:
 *   get:
 *     summary: Obtém um cartão pelo ID
 *     tags: [Cartões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cartão
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cartão encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cartao'
 *       404:
 *         description: Cartão não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter um cartão por ID
router.get("/:id", async (req, res) => {
  try {
    const cartao = await Cartao.findById(req.params.id).populate("usuario");
    if (!cartao) {
      return res.status(404).json({ message: "Cartão não encontrado" });
    }
    res.json(cartao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cartoes/{id}:
 *   put:
 *     summary: Atualiza um cartão pelo ID
 *     tags: [Cartões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cartão
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cartao'
 *     responses:
 *       200:
 *         description: Cartão atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cartao'
 *       404:
 *         description: Cartão não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Atualizar um cartão por ID
router.put("/:id", async (req, res) => {
  try {
    const cartaoAtualizado = await Cartao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!cartaoAtualizado) {
      return res.status(404).json({ message: "Cartão não encontrado" });
    }
    res.json(cartaoAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /cartoes/{id}:
 *   delete:
 *     summary: Deleta um cartão pelo ID
 *     tags: [Cartões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cartão
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cartão deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cartão deletado com sucesso"
 *       404:
 *         description: Cartão não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Deletar um cartão por ID
router.delete("/:id", async (req, res) => {
  try {
    const cartaoDeletado = await Cartao.findByIdAndDelete(req.params.id);
    if (!cartaoDeletado) {
      return res.status(404).json({ message: "Cartão não encontrado" });
    }
    res.json({ message: "Cartão deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
