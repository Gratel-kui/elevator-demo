import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { getTimezoneFromCoordinates, getMonthStarts } from './services/timezoneService';
import { getMonthsStartTimes } from './controllers/monthsController';
import { getFormattedMonthsStartTimes } from './controllers/formattedMonthsController';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * @swagger
 * /months:
 *   get:
 *     summary: Get month start times in ISO format
 *     description: Returns the start times of each month for a specified time range, adjusted for the timezone of the given coordinates.
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the query location
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the query location
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: Start month of the time period (format YYYY-MM)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: End month of the time period (format YYYY-MM)
 *     responses:
 *       200:
 *         description: Successful operation
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
 * /formatted-months:
 *   get:
 *     summary: Get month start times in custom format
 *     description: Returns the start times of each month for a specified time range and format, adjusted for the timezone of the given coordinates.
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the query location
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the query location
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: Start month of the time period (format YYYY-MM)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: End month of the time period (format YYYY-MM)
 *       - in: query
 *         name: dateFormat
 *         required: true
 *         schema:
 *           type: string
 *         description: Format for the returned dates (e.g., YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY)
 *         examples:
 *           iso:
 *             value: ISO
 *             summary: ISO 8601 format
 *           ymd:
 *             value: YYYY-MM-DD
 *             summary: Year-month-day format
 *           dmy:
 *             value: DD-MM-YYYY
 *             summary: Day-month-year format
 *           mdy:
 *             value: MM-DD-YYYY
 *             summary: Month-day-year format
 *           datetime:
 *             value: YYYY-MM-DD HH:mm:ss
 *             summary: Date and time format
 *           strftime:
 *             value: %Y-%m-%d
 *             summary: strftime-style format
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthStarts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["2024-01-31", "2024-02-29", "2024-03-31"]
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     timezone:
 *                       type: string
 *                       example: Asia/Shanghai
 *                     format:
 *                       type: string
 *                       example: YYYY-MM-DD
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
      description: 'API for getting month start times based on geographic location',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/months', getMonthsStartTimes);
app.get('/formatted-months', getFormattedMonthsStartTimes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

export default app; 