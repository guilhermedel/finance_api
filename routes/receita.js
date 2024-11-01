// routes/receitas.js
import express from "express";
import Receita from "../models/Receita.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Receitas
 *   description: Operações relacionadas a receitas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Receita:
 *       type: object
 *       required:
 *         - usuario
 *         - categoria
 *         - descricao
 *         - valor
 *         - data
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da receita
 *         usuario:
 *           type: string
 *           description: ID do usuário associado
 *           example: "60d0fe4f5311236168a109ca"
 *         categoria:
 *           type: string
 *           description: ID da categoria da receita
 *           example: "60d0fe4f5311236168a109cb"
 *         descricao:
 *           type: string
 *           description: Descrição da receita
 *           example: "Salário"
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor da receita
 *           example: 3000.00
 *         data:
 *           type: string
 *           format: date-time
 *           description: Data e hora da receita
 *           example: "2024-04-27T14:30:00Z"
 *       example:
 *         id: "60d0fe4f5311236168a109cf"
 *         usuario: "60d0fe4f5311236168a109ca"
 *         categoria: "60d0fe4f5311236168a109cb"
 *         descricao: "Salário"
 *         valor: 3000.00
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
 * /receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Receita'
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receita'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar uma nova receita
router.post("/", async (req, res) => {
  try {
    const novaReceita = new Receita(req.body);
    await novaReceita.save();
    res.status(201).json(novaReceita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /receitas:
 *   get:
 *     summary: Retorna uma lista de receitas
 *     tags: [Receitas]
 *     responses:
 *       200:
 *         description: Lista de receitas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receita'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todas as receitas
router.get("/", async (req, res) => {
  try {
    const receitas = await Receita.find().populate("usuario categoria");
    res.json(receitas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /receitas/{id}:
 *   get:
 *     summary: Obtém uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da receita
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receita'
 *       404:
 *         description: Receita não encontrada
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
// Obter uma receita por ID
router.get("/:id", async (req, res) => {
  try {
    const receita = await Receita.findById(req.params.id).populate(
      "usuario categoria",
    );
    if (!receita) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }
    res.json(receita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /receitas/{id}:
 *   put:
 *     summary: Atualiza uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da receita
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Receita'
 *     responses:
 *       200:
 *         description: Receita atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receita'
 *       404:
 *         description: Receita não encontrada
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
// Atualizar uma receita por ID
router.put("/:id", async (req, res) => {
  try {
    const receitaAtualizada = await Receita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!receitaAtualizada) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }
    res.json(receitaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /receitas/{id}:
 *   delete:
 *     summary: Deleta uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da receita
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receita deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Receita deletada com sucesso"
 *       404:
 *         description: Receita não encontrada
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
// Deletar uma receita por ID
router.delete("/:id", async (req, res) => {
  try {
    const receitaDeletada = await Receita.findByIdAndDelete(req.params.id);
    if (!receitaDeletada) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }
    res.json({ message: "Receita deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
