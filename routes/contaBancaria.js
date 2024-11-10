// routes/contas.js
import express from "express";
import ContaBancaria from "../models/ContaBancaria.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: contas
 *   description: Operações relacionadas a contas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContaBancaria:
 *       type: object
 *       required:
 *         - card
 *         - value
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da ContaBancaria
 *         card:
 *           type: string
 *           description: ID do cartão utilizado na ContaBancaria
 *           example: "60d0fe4f5311236168a109ca"
 *         value:
 *           type: number
 *           format: float
 *           description: value da ContaBancaria
 *           example: 150.75
 *         date:
 *           type: string
 *           format: date-time
 *           description: date e hora da ContaBancaria
 *           example: "2024-04-27T14:30:00Z"
 * 
 *       example:
 *         id: "60d0fe4f5311236168a109ce"
 *         card: "60d0fe4f5311236168a109ca"
 *         value: 150.75
 *         date: "2024-04-27T14:30:00Z"
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
 * /contas:
 *   post:
 *     summary: Cria uma nova ContaBancaria
 *     tags: [contas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContaBancaria'
 *     responses:
 *       201:
 *         description: ContaBancaria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContaBancaria'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar uma nova ContaBancaria
router.post("/", async (req, res) => {
  try {
    const novaContaBancaria = new ContaBancaria(req.body);
    await novaContaBancaria.save();
    res.status(201).json(novaContaBancaria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /contas:
 *   get:
 *     summary: Retorna uma lista de contas
 *     tags: [contas]
 *     responses:
 *       200:
 *         description: Lista de contas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContaBancaria'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todas as contas
router.get("/", async (req, res) => {
  try {
    const contas = await ContaBancaria.find().populate("userId");
    res.json(contas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /contas/{id}:
 *   get:
 *     summary: Obtém uma ContaBancaria pelo ID
 *     tags: [contas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ContaBancaria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ContaBancaria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContaBancaria'
 *       404:
 *         description: ContaBancaria não encontrada
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
// Obter uma ContaBancaria por ID
router.get("/:userId", async (req, res) => {
  try {
    const {userId} = req.params
    const ContaBancaria = await ContaBancaria.findOne({userId: userId}).populate("card");
    if (!ContaBancaria) {
      return res.status(404).json({ message: "Conta Bancaria não encontrada" });
    }
    res.json(ContaBancaria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /contas/{id}:
 *   put:
 *     summary: Atualiza uma ContaBancaria pelo ID
 *     tags: [contas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ContaBancaria
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContaBancaria'
 *     responses:
 *       200:
 *         description: ContaBancaria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContaBancaria'
 *       404:
 *         description: ContaBancaria não encontrada
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
// Atualizar uma ContaBancaria por ID
router.put("/:id", async (req, res) => {
  try {
    const ContaBancariaAtualizada = await ContaBancaria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!ContaBancariaAtualizada) {
      return res.status(404).json({ message: "Conta Bancaria não encontrada" });
    }
    res.json(ContaBancariaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /contas/{id}:
 *   delete:
 *     summary: Deleta uma ContaBancaria pelo ID
 *     tags: [contas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da ContaBancaria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ContaBancaria deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ContaBancaria deletada com sucesso"
 *       404:
 *         description: ContaBancaria não encontrada
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
// Deletar uma ContaBancaria por ID
router.delete("/:id", async (req, res) => {
  try {
    const contaDeletada = await ContaBancaria.findByIdAndDelete(req.params.id);
    if (!contaDeletada) {
      return res.status(404).json({ message: "Conta Bancaria não encontrada" });
    }
    res.json({ message: "Conta Bancaria deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
