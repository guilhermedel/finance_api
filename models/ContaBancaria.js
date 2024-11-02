import mongoose from 'mongoose';

const ContaBancariaSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  saldo: { type: String, required: true },
  name: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const ContaBancaria = mongoose.model('ContaBancaria', ContaBancariaSchema);

export default ContaBancaria