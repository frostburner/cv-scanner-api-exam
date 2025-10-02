import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './route';
import path from 'path';

dotenv.config();

const app: Application = express();



// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Index.html
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});
// --- API Routes ---
app.use('/api/v1', apiRoutes);

// --- Error Handling ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
