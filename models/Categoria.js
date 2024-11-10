import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color : { type: String,required: true}
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

export default Categoria;
