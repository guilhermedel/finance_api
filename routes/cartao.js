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
 *         - number
 *         - validity
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cartão
 *         number:
 *           type: string
 *           description: Número do cartão
 *           example: "1234-5678-9012-3456"
 *         validity:
 *           type: string
 *           format: date
 *           description: Data de validity do cartão
 *           example: "2025-12-31"
 *         userId:
 *           type: string
 *           description: ID do usuário associado
 *           example: "60d0fe4f5311236168a109ca"
 *       example:
 *         id: "60d0fe4f5311236168a109cb"
 *         number: "1234-5678-9012-3456"
 *         validity: "2025-12-31"
 *         userId: "60d0fe4f5311236168a109ca"
 *     message:
 *       type: object
 *       properties:
 *         message:
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
 *               $ref: '#/components/schemas/message'
 */
// Criar um novo cartão
router.post("/", async (req, res) => {
  try {
    const cartaoExistente = await Cartao.findOne({ cardNumber });
    if (cartaoExistente) {
      return res.status(400).json({ message: "Cartão já cadastrado" });
    }
    const novoCartao = new Cartao(req.body);
    await novoCartao.save();
    res.status(201).json(novoCartao);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 */
// Obter todos os cartões
router.get("/", async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate("userId");
    res.json(cartoes);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
 */
// Obter um cartão por ID
router.get("/:id", async (req, res) => {
  try {
    const cartao = await Cartao.findById(req.params.id).populate("userId");
    if (!cartao) {
      return res.status(404).json({ message: "Cartão não encontrado" });
    }
    res.json(cartao);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
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
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
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
    res.status(500).json({ message: err.message });
  }
});

export default router;
