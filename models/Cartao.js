import mongoose from 'mongoose';

const CartaoSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  cvc: { type: String, required: true },
  nomeUsuario: { type: String, required: true },
  mesValidade: { type: String, required: true },
  anoValidade: { type: String, required: true },
  tipo: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const Cartao = mongoose.model('Cartao', CartaoSchema);

export default Cartao;  // <== Aqui estamos exportando como default
