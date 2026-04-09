const { getDb } = require('../db');

describe('getDb', () => {
  it('should return a database instance', async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });
});