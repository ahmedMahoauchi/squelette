import mongoose from "mongoose";
const connectDB = async () => {
    
    try {
        //mongodb connection string
        mongoose.set('strictQuery', false);
        const con = await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`MongoDB connected :${con.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
export default connectDB