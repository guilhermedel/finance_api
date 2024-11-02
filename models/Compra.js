import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
  estabelecimento: { type: String, required: true },
  valor: { type: Number, required: true },
  date: { type: Date, required: true },
  cartao: { type: mongoose.Schema.Types.ObjectId, ref: 'Cartao' },
  account: {type : Number , required:true}   
});

const Compra = mongoose.model('Compra', CompraSchema);

export default Compra;  // <== Aqui estamos exportando como default
