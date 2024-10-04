import express from 'express';
import Compra from '../models/Compra.js';

const router = express.Router();

// Criar uma nova compra
router.post('/', async (req, res) => {
  try {
    const novaCompra = new Compra(req.body);
    await novaCompra.save();
    res.status(201).json(novaCompra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todas as compras
router.get('/', async (req, res) => {
  try {
    const compras = await Compra.find().populate('cartao');
    res.json(compras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma compra por ID
router.get('/:id', async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate('cartao');
    if (!compra) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    res.json(compra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma compra por ID
router.put('/:id', async (req, res) => {
  try {
    const compraAtualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compraAtualizada) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    res.json(compraAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar uma compra por ID
router.delete('/:id', async (req, res) => {
  try {
    const compraDeletada = await Compra.findByIdAndDelete(req.params.id);
    if (!compraDeletada) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    res.json({ message: 'Compra deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
