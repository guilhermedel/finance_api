import mongoose from 'mongoose';

const ReceitaSchema = new mongoose.Schema({
  expenseValue: { type: Number, required: true },
  expenseType: { type: String, enum: ['entrada', 'saida'], required: true },
  expenseName: { type: String, required: true },
  expenseEstablishment: { type: String },
  date: { type: Date, required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContaBancaria'},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
});

const Receita = mongoose.model('Receita', ReceitaSchema);

export default Receita;  // <== Aqui estamos exportando como default
