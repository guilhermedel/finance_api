import mongoose from 'mongoose';

const ReceitaSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  origemDestino: { type: String },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
});

const Receita = mongoose.model('Receita', ReceitaSchema);

export default Receita;  // <== Aqui estamos exportando como default
