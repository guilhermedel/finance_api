import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
  store: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: String, required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cartao' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'ContaBancaria', required: true },
  paymentMethod: { type: String, enum: ['credito', 'debito','pix'], required: true },   
});

const Compra = mongoose.model('Compra', CompraSchema);

export default Compra;  // <== Aqui estamos exportando como default
