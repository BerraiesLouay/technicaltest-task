# technicaltest-task

This is for the technical test purpose.

## Installation

### Prerequisites
- Node.js (v20.20.)

### Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the `backend` directory with the required environment variables:

3. Update the `.env` file with your actual values

## Environment Variables

```env
PORT=5000
ZENDESK_BASE_URL=
ZENDESK_OAUTH_TOKEN=
TARGET_USER_ID=
```

### Variable Descriptions
- `PORT` - The port on which the server will run (default: 5000)
- `ZENDESK_BASE_URL` - Your Zendesk API base URL
- `ZENDESK_OAUTH_TOKEN` - Your Zendesk OAuth token for API authentication
- `TARGET_USER_ID` - The Zendesk user ID to fetch tickets for
