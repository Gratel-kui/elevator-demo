import { Request, Response } from 'express';
import { getTimezoneFromCoordinates, getMonthStarts } from '../services/timezoneService';

export function getMonthsStartTimes(req: Request, res: Response): void {
  try {
    // Get query parameters
    const lon = parseFloat(req.query.lon as string);
    const lat = parseFloat(req.query.lat as string);
    const from = req.query.from as string;
    const to = req.query.to as string;
    
    // Validate parameters
    if (isNaN(lon) || isNaN(lat) || !from || !to) {
      res.status(400).json({ error: 'Missing or invalid parameters' });
      return;
    }
    
    // Get timezone
    const timezone = getTimezoneFromCoordinates(lon, lat);
    
    // Get month start times
    const monthStarts = getMonthStarts(timezone, from, to);
    
    // Return results
    res.json({ monthStarts });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 