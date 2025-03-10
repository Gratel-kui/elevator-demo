import request from 'supertest';
import app from '../src/app';

describe('Formatted Months API', () => {
  it('should return month starts in YYYY-MM-DD format', async () => {
    const response = await request(app)
      .get('/formatted-months')
      .query({
        lon: 121.4691,
        lat: 31.2243,
        from: '2024-01',
        to: '2024-03',
        dateFormat: 'YYYY-MM-DD'
      });

    expect(response.status).toBe(200);
    expect(response.body.monthStarts).toHaveLength(3);
    expect(response.body.monthStarts[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(response.body.metadata.format).toBe('YYYY-MM-DD');
    expect(response.body.metadata.timezone).toBe('Asia/Shanghai');
  });

  it('should return month starts in DD-MM-YYYY format', async () => {
    const response = await request(app)
      .get('/formatted-months')
      .query({
        lon: 121.4691,
        lat: 31.2243,
        from: '2024-01',
        to: '2024-01',
        dateFormat: 'DD-MM-YYYY'
      });

    expect(response.status).toBe(200);
    expect(response.body.monthStarts).toHaveLength(1);
    expect(response.body.monthStarts[0]).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    expect(response.body.metadata.format).toBe('DD-MM-YYYY');
  });

  it('should return 400 if dateFormat is missing', async () => {
    const response = await request(app)
      .get('/formatted-months')
      .query({
        lon: 121.4691,
        lat: 31.2243,
        from: '2024-01',
        to: '2024-01'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should return 400 if parameters are invalid', async () => {
    const response = await request(app)
      .get('/formatted-months')
      .query({
        lon: 'invalid',
        lat: 31.2243,
        from: '2024-01',
        to: '2024-01',
        dateFormat: 'YYYY-MM-DD'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
}); 