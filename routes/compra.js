// routes/compras.js
import express from "express";
import Compra from "../models/Compra.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Operações relacionadas a compras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Compra:
 *       type: object
 *       required:
 *         - cartao
 *         - valor
 *         - data
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da compra
 *         cartao:
 *           type: string
 *           description: ID do cartão utilizado na compra
 *           example: "60d0fe4f5311236168a109ca"
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor da compra
 *           example: 150.75
 *         data:
 *           type: string
 *           format: date-time
 *           description: Data e hora da compra
 *           example: "2024-04-27T14:30:00Z"
 *       example:
 *         id: "60d0fe4f5311236168a109ce"
 *         cartao: "60d0fe4f5311236168a109ca"
 *         valor: 150.75
 *         data: "2024-04-27T14:30:00Z"
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
 * /compras:
 *   post:
 *     summary: Cria uma nova compra
 *     tags: [Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Compra'
 *     responses:
 *       201:
 *         description: Compra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar uma nova compra
router.post("/", async (req, res) => {
  try {
    const novaCompra = new Compra(req.body);
    await novaCompra.save();
    res.status(201).json(novaCompra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Retorna uma lista de compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todas as compras
router.get("/", async (req, res) => {
  try {
    const compras = await Compra.find().populate("cartao");
    res.json(compras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Obtém uma compra pelo ID
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da compra
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       404:
 *         description: Compra não encontrada
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
// Obter uma compra por ID
router.get("/:id", async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate("cartao");
    if (!compra) {
      return res.status(404).json({ message: "Compra não encontrada" });
    }
    res.json(compra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /compras/{id}:
 *   put:
 *     summary: Atualiza uma compra pelo ID
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da compra
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Compra'
 *     responses:
 *       200:
 *         description: Compra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       404:
 *         description: Compra não encontrada
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
// Atualizar uma compra por ID
router.put("/:id", async (req, res) => {
  try {
    const compraAtualizada = await Compra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!compraAtualizada) {
      return res.status(404).json({ message: "Compra não encontrada" });
    }
    res.json(compraAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /compras/{id}:
 *   delete:
 *     summary: Deleta uma compra pelo ID
 *     tags: [Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da compra
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compra deletada com sucesso"
 *       404:
 *         description: Compra não encontrada
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
// Deletar uma compra por ID
router.delete("/:id", async (req, res) => {
  try {
    const compraDeletada = await Compra.findByIdAndDelete(req.params.id);
    if (!compraDeletada) {
      return res.status(404).json({ message: "Compra não encontrada" });
    }
    res.json({ message: "Compra deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
