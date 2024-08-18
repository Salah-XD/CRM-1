import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://unavarsteamtroops:GMwV28w95dzBABPT@crm.dfxonys.mongodb.net/?retryWrites=true&w=majority&appName=CRM");
    console.log(
      `Conneted To Mongodb Databse ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Errro in Mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;
