import mongoose from 'mongoose';

const ContaBancariaSchema = new mongoose.Schema({
  accountBankingName: { type: String, required: true },
  accountBalance: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const ContaBancaria = mongoose.model('ContaBancaria', ContaBancariaSchema);

export default ContaBancaria
