const { 
  fetchCCdTickets, 
  removeUserFromCC, 
  isGlobalLimitExceeded, 
  isUserLimitExceeded, 
  logging 
} = require('../zendeskService');
    jest.mock('../db', () => ({    
    getDb: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue(null),  
    run: jest.fn()
  })
}));
const getMockDb = async () => await require('../db').getDb();

describe('fetchCCdTickets', () => {
  it('should return an array of tickets', async () => {
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
describe('Rate Limit Helpers', () => {
  it('isGlobalLimitExceeded should return true when count is 3 or more', async () => {
    const db = await getMockDb();
    db.get.mockResolvedValueOnce({ count: 3 });
    const result = await isGlobalLimitExceeded(db, Date.now());
    expect(result).toBe(true);
  });

  it('isUserLimitExceeded should return true when count is 1 or more', async () => {
    const db = await getMockDb();
    db.get.mockResolvedValueOnce({ count: 1 });
    const result = await isUserLimitExceeded(db, 'user-123', Date.now());
    expect(result).toBe(true);
  });
});

describe('logging', () => {
  it('should insert a record into the logs table', async () => {
    const db = await getMockDb();
    await logging('user-123');
    expect(db.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO logs'),
      expect.arrayContaining(['user-123', 'remove_cc'])
    );
  });
});

describe('removeUserFromCC', () => {
  it('should return true and clear cache when Zendesk API succeeds', async () => {
    const db = await getMockDb();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    const result = await removeUserFromCC('ticket-101');

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('tickets/101.json'),
      expect.objectContaining({ method: 'PUT' })
    );
    // Verify cache deletion call
    expect(db.run).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM ticket_cache'),
      ['cc_tickets_cache']
    );
  });
});