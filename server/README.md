# Ad Campaign Management Platform - Server

Production-grade backend API for managing ad campaigns with analytics, budgets, and media uploads.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👥 Role-based access control (Admin, Campaign Manager, Client, Viewer)
- 📊 Campaign management with metrics tracking
- 📈 Analytics with aggregated statistics
- 💰 Budget management with transaction history
- 📁 Media upload with validation
- 📚 Swagger API documentation
- 🛡️ Security features (Helmet, Rate limiting, CORS)
- 📝 Request logging with Morgan
- 🐛 Error handling with Winston logger

## Tech Stack

- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- JWT for authentication
- Multer for file uploads
- Swagger for API documentation
- Winston for logging
- Express-validator for input validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance running (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Development

Run the development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Run the compiled production build:
```bash
npm start
```

## API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PATCH /api/v1/users/:id/role` - Change user role

### Campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns` - Get all campaigns
- `GET /api/v1/campaigns/:id` - Get campaign by ID
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign
- `PATCH /api/v1/campaigns/:id/pause` - Pause campaign
- `PATCH /api/v1/campaigns/:id/activate` - Activate campaign
- `PATCH /api/v1/campaigns/:id/assign` - Assign clients

### Analytics
- `POST /api/v1/analytics/campaigns/:campaignId` - Record analytics
- `GET /api/v1/analytics/campaigns/:campaignId` - Get campaign analytics
- `GET /api/v1/analytics/campaigns/:campaignId/aggregate` - Get aggregated stats
- `GET /api/v1/analytics/campaigns/:campaignId/export` - Export report

### Budget
- `POST /api/v1/budget/campaigns/:campaignId` - Set budget
- `GET /api/v1/budget/campaigns/:campaignId` - Get budget
- `PUT /api/v1/budget/campaigns/:campaignId` - Update budget
- `POST /api/v1/budget/campaigns/:campaignId/spend` - Track spending
- `GET /api/v1/budget/campaigns/:campaignId/history` - Get budget history

### Media
- `POST /api/v1/media/upload` - Upload media file
- `GET /api/v1/media/:id` - Get media by ID
- `DELETE /api/v1/media/:id` - Delete media
- `GET /api/v1/media/campaigns/:campaignId` - Get campaign media

## User Roles & Permissions

### Admin
- Full access to all resources
- User management
- Can modify all campaigns

### Campaign Manager
- Create and manage own campaigns
- Assign clients to campaigns
- Record analytics and manage budgets

### Client
- View assigned campaigns
- View campaign analytics

### Viewer
- Read-only access to public data

## Project Structure

```
server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── swagger/         # API documentation
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── server.ts        # App entry point
├── uploads/             # Uploaded media files
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- File upload restrictions (type & size)

## Error Handling

All errors are handled centrally and return consistent JSON responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Logging

- Winston logger for production-grade logging
- Separate log files for errors and combined logs
- Morgan for HTTP request logging

## License

ISC

