# technicaltest-task

This is for the technical test purpose.

NB: Currently the list of tickets is empty

## Docker



### Prerequisites
- Node.js (v20.20.2)
- Docker (optional, for fast setup)
```bash
cd backend
npm install or npm ci
```

### Docker Quick Start

Ensure your .env file is configured in the backend directory.
```bash
docker-compose up --build
```

### Setup

1. Install backend dependencies:
```bash
cd backend
npm install or npm ci

```

2. Create a `.env` file in the `backend` directory with the required environment variables:

3. Run the backend:
```bash
npx tsx src/server.ts
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Run the frontend:
```bash
npm run dev
```
## Unit testing

```bash
npm test 
```
tests are just simulating happy path (TODOS) 
Coverage 75.24

## Environment Variables

```env
PORT=5000
ZENDESK_BASE_URL=
ZENDESK_OAUTH_TOKEN=
TARGET_USER_ID=
CORS_ORIGIN=
```

### Variable Descriptions
- `PORT` - The port on which the server will run (default: 5000)
- `ZENDESK_BASE_URL` - Your Zendesk API base URL
- `ZENDESK_OAUTH_TOKEN` - Your Zendesk OAuth token for API authentication
- `TARGET_USER_ID` - The Zendesk user ID to fetch tickets for

### Perspectives

Invest more time on the UI
Generate and Scan SBOM to be safe in term of vulnerabilities & packages
Implement same retry process for the delete API ( done for the display)