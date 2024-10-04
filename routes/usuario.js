import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Criar um novo usuário
router.post('/', async (req, res) => {
  try {
    const novoUsuario = new Usuario(req.body);
    await novoUsuario.save();
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter todos os usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um usuário por ID
router.put('/:id', async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar um usuário por ID
router.delete('/:id', async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
