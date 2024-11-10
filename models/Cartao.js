import mongoose from 'mongoose';

const CartaoSchema = new mongoose.Schema({
  number: { type: String, required: true },
  cvc: { type: String, required: true },
  validity: { type: String, required: true },
  type: { type: String,enum:['credito','debito'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const Cartao = mongoose.model('Cartao', CartaoSchema);

export default Cartao;  // <== Aqui estamos exportando como default
