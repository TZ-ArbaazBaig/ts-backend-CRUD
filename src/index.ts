import { config } from 'dotenv';
config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
import express, { type Express } from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import routes from './routes/index.js';

connectDB();
const app: Express = express();
const PORT = process.env.PORT || 7000;

app.use(cors(
    {
        origin: process.env.HOST_URL || '*'
    }
));

app.use(express.json());
app.use('/api/v1', routes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
