import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { getTimezoneFromCoordinates, getMonthStarts } from './services/timezoneService';
import { getMonthsStartTimes } from './controllers/monthsController';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * @swagger
 * /months:
 *   get:
 *     summary: Get month start times in UTC for a specific location
 *     description: Returns an array of ISO 8601 UTC timestamps for the start of each month in the specified time range
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Start month in YYYY-MM format
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: End month in YYYY-MM format
 *     responses:
 *       200:
 *         description: Successful response with month start times
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthStarts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["2024-01-31T16:00:00.000Z", "2024-02-29T16:00:00.000Z"]
 *       400:
 *         description: Invalid parameters provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns OK if the service is running
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Timezone API',
      version: '1.0.0',
      description: 'API service for getting timezone information based on geographic location',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to all TypeScript files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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