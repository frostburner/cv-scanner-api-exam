import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './route';

dotenv.config();

const app: Application = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'CV Scanner API is running!' });
});

app.use('/api/v1', apiRoutes);


// --- Error Handling ---
// This is a placeholder for a more robust error handler.
// The applicant can improve this.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


export default app;
