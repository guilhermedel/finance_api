// routes/compras.js
import express from "express";
import Compra from "../models/Compra.js";
import ContaBancaria from "../models/ContaBancaria.js";

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
 *         - card
 *         - value
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da compra
 *         card:
 *           type: string
 *           description: ID do cartão utilizado na compra
 *           example: "60d0fe4f5311236168a109ca"
 *         value:
 *           type: number
 *           format: float
 *           description: value da compra
 *           example: 150.75
 *         date:
 *           type: string
 *           format: date-time
 *           description: date e hora da compra
 *           example: "2024-04-27T14:30:00Z"
 * 
 *       example:
 *         id: "60d0fe4f5311236168a109ce"
 *         card: "60d0fe4f5311236168a109ca"
 *         value: 150.75
 *         date: "2024-04-27T14:30:00Z"
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
 *               $ref: '#/components/schemas/message'
 */
// Criar uma nova compra
router.post("/", async (req, res) => {
  
  try {
    const {
      store,
      value,
      cardNumber,
      categoryName,
      userId,
      accountBankingNames,
      paymentMethod,
      date
    } = req.body;

    // 1. Buscar o Cartão pelo número
    const cartao = await Cartao.findOne({ number: cardNumber }).session(session);
    if (!cartao) {
      session.endSession();
      return res.status(404).json({ message: 'Cartão não encontrado com o número fornecido.' });
    }

    // 2. Buscar a Categoria pelo nome
    const categoria = await Categoria.findOne({ name: categoryName }).session(session);
    if (!categoria) {
      session.endSession();
      return res.status(404).json({ message: 'Categoria não encontrada com o nome fornecido.' });
    }

    // 3. Buscar a Conta Bancária pelo nome
    const conta = await ContaBancaria.findOne({ accountBankingName: accountBankingNames }).session(session);
    if (!conta) {
      return res.status(404).json({ message: 'Conta bancária não encontrada.' });
    }

    // 4. Verificar se há saldo suficiente
    if (conta.accountBalance < value) {
      return res.status(400).json({ message: 'Saldo insuficiente na conta bancária.' });
    }

    // 5. Diminuir o saldo da conta bancária
    conta.accountBalance -= value;
    await conta.save({ accountBalance });

    // 6. Criar a nova compra com os IDs encontrados
    const novaCompra = new Compra({
      store,
      value,
      date: date ? new Date(date) : new Date(),
      paymentMethod,
      cardId: cartao._id,
      categoryId: categoria._id,
      userId: userId,
      accountId: conta._id
      // Outros campos adicionais
    });

    // 7. Salvar a compra no banco de dados
    await novaCompra.save({ session });
    res.status(201).json(novaCompra);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
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
 *               $ref: '#/components/schemas/message'
 */
// Obter todas as compras
router.get("/", async (req, res) => {
  try {
    const compras = await Compra.find().populate("cardId").populate("categoryId").populate("accountId").populate("userId");
    res.json(compras);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
 */
// Obter uma compra por ID
router.get("/:id", async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate("cardId").populate("categoryId").populate("accountId").populate("userId");
    if (!compra) {
      return res.status(404).json({ message: "Compra não encontrada" });
    }
    res.json(compra);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
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
    res.status(500).json({ message: err.message });
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
 *               $ref: '#/components/schemas/message'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
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
    res.status(500).json({ message: err.message });
  }
});

export default router;
