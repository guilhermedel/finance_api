import mongoose from 'mongoose';

const ReceitaSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  type: { type: String, enum: ['entrada', 'saida'], required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria',required:true },
});

const Receita = mongoose.model('Receita', ReceitaSchema);

export default Receita;  // <== Aqui estamos exportando como default
