import mongoose from 'mongoose';

const CartaoSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  cardCVC: { type: String, required: true },
  cardDateValidity: { type: String, required: true },
  cardName: { type: String, required: true },
  cardLimited: {type: Number, required: true},
  cardFlag: { type: String,enum:['visa','mastercard'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const Cartao = mongoose.model('Cartao', CartaoSchema);

export default Cartao;  // <== Aqui estamos exportando como default
