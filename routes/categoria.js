// routes/categorias.js
import express from "express";
import Categoria from "../models/Categoria.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Operações relacionadas a categorias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da categoria
 *         name:
 *           type: string
 *           description: name da categoria
 *           example: "Eletrônicos"
 *       example:
 *         id: "60d0fe4f5311236168a109cd"
 *         name: "Eletrônicos"
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
 * /categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Criar uma nova categoria
router.post("/", async (req, res) => {
  try {
    const categoriaExistente = await Categoria.findOne({ categoryName: req.body.categoryName, userId: req.body.userId });
    if (categoriaExistente) {
      return res.status(400).json({ message: "Categoria já existe para este usuário" });
    }
    const novaCategoria = new Categoria(req.body);
    await novaCategoria.save();
    res.status(201).json(novaCategoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Retorna uma lista de categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Obter todas as categorias
router.get("/", async (req, res) => {
  try {
    const categoriasComRevenue = await Categoria.aggregate([
      {
        // Realiza um lookup para trazer as receitas associadas a cada categoria
        $lookup: {
          from: "receitas", // Nome da coleção de receitas no MongoDB
          localField: "_id",
          foreignField: "categoryId",
          as: "receitas"
        }
      },
      {
        // Adiciona o campo revenueValue calculando a soma e subtração dos valores
        $addFields: {
          revenueValue: {
            $sum: {
              $map: {
                input: "$receitas",
                as: "receita",
                in: {
                  $cond: [
                    { $eq: ["$$receita.expenseType", "saida"] },
                    "$$receita.expenseValue",
                    { $multiply: ["$$receita.expenseValue", -1] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        // Opcional: Remove o array de receitas da resposta
        $project: {
          receitas: 0
        }
      }
    ]);

    res.json(categoriasComRevenue);
  } catch (err) {
    console.error('Erro ao obter categorias com revenueValue:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtém uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria não encontrada
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
// Obter uma categoria por ID
router.get("/:id", async (req, res) => {
  try {
    const categoriaId = req.params.id; // Obtém o ID da categoria dos parâmetros da requisição

    const categoriasComRevenue = await Categoria.aggregate([
      {
        // Filtra para pegar apenas a categoria específica pelo ID
        $match: {
          _id: new mongoose.Types.ObjectId(categoriaId) // Converte o ID para ObjectId do MongoDB
        }
      },
      {
        // Realiza um lookup para trazer as receitas associadas à categoria
        $lookup: {
          from: "receitas", // Nome da coleção de receitas no MongoDB
          localField: "_id",
          foreignField: "categoryId",
          as: "receitas"
        }
      },
      {
        // Adiciona o campo revenueValue calculando a soma dos valores do tipo 'saida'
        $addFields: {
          revenueValue: {
            $map: {
              input: "$receitas",
              as: "receita",
              in: {
                $cond: [
                  { $eq: ["$$receita.expenseType", "saida"] },
                  "$$receita.expenseValue",
                  { $multiply: ["$$receita.expenseValue", -1] }
                ]
              }
            }
          }
        }
      },
      {
        // Opcional: Remove o array de receitas da resposta
        $project: {
          receitas: 0
        }
      }
    ]);

    if (categoriasComRevenue.length === 0) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    res.json(categoriasComRevenue[0]); // Retorna a categoria específica encontrada
  } catch (err) {
    console.error('Erro ao obter categoria com revenueValue:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria não encontrada
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
// Atualizar uma categoria por ID
router.put("/:id", async (req, res) => {
  try {
    const categoriaAtualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!categoriaAtualizada) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json(categoriaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Deleta uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria deletada com sucesso"
 *       404:
 *         description: Categoria não encontrada
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
// Deletar uma categoria por ID
router.delete("/:id", async (req, res) => {
  try {
    const categoriaDeletada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaDeletada) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
