import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
  store: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: String, required: true },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Cartao' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  account: {type : Number , required:true},
  paymentMethod: { type: String, enum: ['credito', 'debito','pix'], required: true },   
});

const Compra = mongoose.model('Compra', CompraSchema);

export default Compra;  // <== Aqui estamos exportando como default
