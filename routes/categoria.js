import express from 'express';
import Categoria from '../models/Categoria.js';

const router = express.Router();

// Criar uma nova categoria
router.post('/', async (req, res) => {
  try {
    const novaCategoria = new Categoria(req.body);
    await novaCategoria.save();
    res.status(201).json(novaCategoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todas as categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma categoria por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma categoria por ID
router.put('/:id', async (req, res) => {
  try {
    const categoriaAtualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoriaAtualizada) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(categoriaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar uma categoria por ID
router.delete('/:id', async (req, res) => {
  try {
    const categoriaDeletada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaDeletada) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
