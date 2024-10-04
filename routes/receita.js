import express from 'express';
import Receita from '../models/Receita.js';

const router = express.Router();

// Criar uma nova receita
router.post('/', async (req, res) => {
  try {
    const novaReceita = new Receita(req.body);
    await novaReceita.save();
    res.status(201).json(novaReceita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todas as receitas
router.get('/', async (req, res) => {
  try {
    const receitas = await Receita.find().populate('usuario categoria');
    res.json(receitas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma receita por ID
router.get('/:id', async (req, res) => {
  try {
    const receita = await Receita.findById(req.params.id).populate('usuario categoria');
    if (!receita) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }
    res.json(receita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma receita por ID
router.put('/:id', async (req, res) => {
  try {
    const receitaAtualizada = await Receita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receitaAtualizada) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }
    res.json(receitaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar uma receita por ID
router.delete('/:id', async (req, res) => {
  try {
    const receitaDeletada = await Receita.findByIdAndDelete(req.params.id);
    if (!receitaDeletada) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }
    res.json({ message: 'Receita deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
