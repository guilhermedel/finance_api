
import mongoose from 'mongoose';
const uri = "mongodb+srv://guilhermeabreu:PeVWMJX7xWpNbAqt@finance.ed4ee.mongodb.net/?retryWrites=true&w=majority&appName=finance";

//guilhermeabreu:PeVWMJX7xWpNbAqt

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectDB = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
