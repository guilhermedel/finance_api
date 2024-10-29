import express from 'express';
import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const SECRET_KEY = 'sua_chave_secreta_jwt'; // Em produção, use variáveis de ambiente

// Middleware de autenticação
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.usuario = usuario;
    next();
  });
};

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      response: { token: token, id: usuario._id, email: usuario.email, nome: usuario.nome }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo usuário (Registro)
router.post('/registro', async (req, res) => {
  try {
    const { email, senha, nome } = req.body;
    
    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      email,
      senha: senhaCriptografada,
      nome
    });

    await novoUsuario.save();

    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',       
      response: { 
        token: token,
        id: novoUsuario._id, 
        email: novoUsuario.email, 
        nome: novoUsuario.nome 
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotas protegidas abaixo (requerem autenticação)

// Obter todos os usuários
router.get('/', autenticarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json({
      message: 'Usuários encontrados com sucesso',
      response: usuarios
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um usuário por ID
router.get('/:id', autenticarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({
      message: 'Usuário encontrado com sucesso',
      response: usuario
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um usuário por ID
router.put('/:id', autenticarToken, async (req, res) => {
  try {
    if (req.body.senha) {
      const salt = await bcrypt.genSalt(10);
      req.body.senha = await bcrypt.hash(req.body.senha, salt);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-senha');

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({
      message: 'Usuário atualizado com sucesso',
      response: usuarioAtualizado
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar um usuário por ID
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({
      message: 'Usuário deletado com sucesso',
      response: usuarioDeletado
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
