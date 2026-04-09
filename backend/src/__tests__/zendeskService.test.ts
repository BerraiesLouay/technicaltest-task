const { fetchCCdTickets } = require('../zendeskService');
jest.mock('../db', () => ({
  getDb: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue(null),  
    run: jest.fn()
  })
}));

describe('fetchCCdTickets', () => {
  it('should return an array of tickets', async () => {
    // Mock environment variables
    process.env.ZENDESK_BASE_URL = 'https://test.zendesk.com/api/v2';
    process.env.ZENDESK_OAUTH_TOKEN = 'test-token';
    process.env.TARGET_USER_ID = '12345';

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: 1, subject: 'Test ticket' }])
    });

    const tickets = await fetchCCdTickets();
    expect(Array.isArray(tickets)).toBe(true);
    expect(tickets.length).toBeGreaterThan(0);
    expect(global.fetch).toHaveBeenCalled();  // Verify API was called, not cache
  });
});