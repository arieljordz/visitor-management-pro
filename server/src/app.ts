import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080', // your React app
    credentials: true, // allow cookies/credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// routes
app.use('/api', routes);

// 404 handler BEFORE error handler
app.use(notFound);

// error handler (last in stack)
app.use(errorHandler);

export default app;
