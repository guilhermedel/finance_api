import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateBirthday: { type: String,required:true },
  gender: { type: String,enum: ['M', 'F'],required:true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

export default Usuario;  // <== Aqui estamos exportando como default
