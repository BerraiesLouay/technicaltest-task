const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  it('should respond to GET /api/tickets', async () => {
    const response = await request(app).get('/api/tickets');
    expect(response.status).toBe(200);
  });
});