import { Request, Response } from 'express';
import { getTimezoneFromCoordinates, getMonthStarts } from '../services/timezoneService';

/**
 * Get month start times with custom date format
 */
export function getFormattedMonthsStartTimes(req: Request, res: Response): void {
  try {
    // Get query parameters
    const lon = parseFloat(req.query.lon as string);
    const lat = parseFloat(req.query.lat as string);
    const from = req.query.from as string;
    const to = req.query.to as string;
    const dateFormat = req.query.dateFormat as string;
    
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
    
    if (!dateFormat) {
      res.status(400).json({ error: 'dateFormat parameter is required' });
      return;
    }
    
    // Get timezone
    const timezone = getTimezoneFromCoordinates(lon, lat);
    
    // Get month start times with the specified format
    const monthStarts = getMonthStarts(timezone, from, to, dateFormat);
    
    // Return results
    res.json({ 
      monthStarts,
      metadata: {
        timezone,
        format: dateFormat
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 