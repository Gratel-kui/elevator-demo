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
    if (isNaN(lon)) {
      res.status(400).json({ error: 'Invalid longitude parameter' });
      return;
    }
    
    if (isNaN(lat)) {
      res.status(400).json({ error: 'Invalid latitude parameter' });
      return;
    }
    
    if (!from || !/^\d{4}-\d{2}$/.test(from)) {
      res.status(400).json({ error: 'Invalid from parameter. Format should be YYYY-MM' });
      return;
    }
    
    if (!to || !/^\d{4}-\d{2}$/.test(to)) {
      res.status(400).json({ error: 'Invalid to parameter. Format should be YYYY-MM' });
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
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 