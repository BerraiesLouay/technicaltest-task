const request = require('supertest');
const serverImport = require('../controllers/server.ts');
const app = serverImport.default || serverImport; 
// Supertest crashed because an object isn't a server, so we export the app instance directly from server.ts

describe('Server', () => {
  it('should respond to GET /api/tickets', async () => {
    const response = await request(app).get('/api/tickets');    
    expect(response.status).toBe(200);
  });
});