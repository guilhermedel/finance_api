import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  categoryColor: { type: String,required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

export default Categoria;
