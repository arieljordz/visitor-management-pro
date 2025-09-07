// server.ts
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📱 Backend API: http://localhost:${PORT}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error('❌ Unhandled Promise Rejection:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err: Error) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
