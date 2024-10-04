import express from 'express';
import Cartao from '../models/Cartao.js';

const router = express.Router();

// Criar um novo cartão
router.post('/', async (req, res) => {
  try {
    const novoCartao = new Cartao(req.body);
    await novoCartao.save();
    res.status(201).json(novoCartao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todos os cartões
router.get('/', async (req, res) => {
  try {
    const cartoes = await Cartao.find().populate('usuario');
    res.json(cartoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um cartão por ID
router.get('/:id', async (req, res) => {
  try {
    const cartao = await Cartao.findById(req.params.id).populate('usuario');
    if (!cartao) {
      return res.status(404).json({ message: 'Cartão não encontrado' });
    }
    res.json(cartao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um cartão por ID
router.put('/:id', async (req, res) => {
  try {
    const cartaoAtualizado = await Cartao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cartaoAtualizado) {
      return res.status(404).json({ message: 'Cartão não encontrado' });
    }
    res.json(cartaoAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar um cartão por ID
router.delete('/:id', async (req, res) => {
  try {
    const cartaoDeletado = await Cartao.findByIdAndDelete(req.params.id);
    if (!cartaoDeletado) {
      return res.status(404).json({ message: 'Cartão não encontrado' });
    }
    res.json({ message: 'Cartão deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
