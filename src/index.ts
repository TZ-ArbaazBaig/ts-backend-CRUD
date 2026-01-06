import { config } from 'dotenv';
config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
import express, { type Express } from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import routes from './routes/index.js';
import { v2 as cloudinary } from "cloudinary";
import { connectRedis } from './utils/reddis.js';
import { errorHandler } from './middleware/error_middleware.js';

connectDB();
connectRedis();
const app: Express = express();
const PORT = process.env.PORT || 7000;

app.use(cors(
    {
        origin: process.env.HOST_URL || '*'
    }
));
cloudinary.config({
  cloud_name: "dvzvazhrc",
  api_key: "526672243753389",
  api_secret: "wH9vCtdONcFEFlSR1bInQr4ZQiU",
});

app.use(express.json());
app.use('/api/v1', routes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
