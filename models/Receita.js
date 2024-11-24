import mongoose from 'mongoose';

const ReceitaSchema = new mongoose.Schema({
  expenseValue: { type: Number, required: true },
  expenseType: { type: String, enum: ['entrada', 'saida'], required: true },
  expenseName: { type: String, required: true },
  expenseEstablishment: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria',required:true },
});

const Receita = mongoose.model('Receita', ReceitaSchema);

export default Receita;  // <== Aqui estamos exportando como default
