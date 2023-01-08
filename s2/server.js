import express from 'express'
import mongoose from 'mongoose';
import gameRoutes from './routes/game.js'
import userRoutes from './routes/user.js'


const app = express();
const port = process.env.PORT || 9092
const databaseName = "revision1"

mongoose.set('strictQuery', true);
mongoose.set('debug',true);
mongoose.Promise=global.Promise;
mongoose
    .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
    .then(()=>{
        console.log(`Connected to mongodb://127.0.0.1:27017/${databaseName}`);
    })
    .catch(err => {
        console.log(err);
    })





app.use(express.json());
app.use(gameRoutes);
app.use(userRoutes);




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

