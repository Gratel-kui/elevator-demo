import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getMonthsStartTimes } from './controllers/monthsController';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get('/months', getMonthsStartTimes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 