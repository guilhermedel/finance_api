import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number },
  dataNascimento: { type: Date },
  genero: { type: String },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

export default Usuario;  // <== Aqui estamos exportando como default
