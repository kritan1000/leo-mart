# LeoMart Backend - Sprint 2 Authentication

Complete authentication system with user registration, login, JWT tokens, and secure password handling.

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
# Create .env file with required variables (see .env template)

# Start development server
npm run dev
```

Server runs at `http://localhost:5000`

## Environment Setup

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leo_mart
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/profile` - Get user profile (requires token)
- `POST /api/users/logout` - Logout and clear token

### Utilities
- `GET /health` - Server health check

## Features

✅ **User Registration**
- Email validation and uniqueness
- Password hashing with bcryptjs
- Input validation with Zod
- Error handling for duplicate emails

✅ **User Login**
- Secure password verification
- JWT token generation
- HttpOnly cookie storage
- Token expiration (7 days)

✅ **Protected Routes**
- JWT middleware for authentication
- Token verification
- User profile access

✅ **Error Handling**
- Custom exception classes
- Zod validation errors
- HTTP status codes
- Meaningful error messages

## Project Structure

```
src/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── database/           # Database connection
├── dtos/               # Data validation schemas
├── exceptions/         # Custom exceptions
├── middleware/         # Authentication middleware
├── models/             # Mongoose schemas
├── repositories/       # Data access layer (reserved)
├── routes/             # API routes
├── services/           # Business logic
├── types/              # TypeScript types
└── utils/              # Helper functions
```

## Security Features

- 🔐 Bcryptjs password hashing (10 rounds)
- 🔑 JWT token authentication
- 🍪 HttpOnly secure cookies
- ✔️ Input validation with Zod
- 🌐 CORS configuration
- 🚫 Duplicate email prevention
- ⏱️ Token expiration

## Scripts

```bash
npm run dev      # Start development server with ts-node
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled JavaScript
npm run lint     # Run ESLint
```

## Database

### Collections
**users**
- email (unique, required)
- firstName
- lastName
- password (hashed)
- createdAt
- updatedAt

### Connection
- Local: `mongodb://localhost:27017/leo_mart`
- Atlas: `mongodb+srv://user:password@cluster.mongodb.net/leo_mart`

## API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing

### Using Postman
1. Import `LeoMart_Auth_API.postman_collection.json`
2. Follow test sequence:
   - Register user
   - Login
   - Get profile
   - Logout

See `POSTMAN_GUIDE.md` for detailed instructions.

## Documentation

- **IMPLEMENTATION_GUIDE.md** - Complete setup and architecture guide
- **POSTMAN_GUIDE.md** - Postman testing and API documentation
- **API Responses** - See endpoint sections above

## Troubleshooting

### MongoDB Connection
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- For Atlas, whitelist your IP

### Port in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Token Invalid
- Verify JWT_SECRET hasn't changed
- Check token hasn't expired (7 days)
- Ensure correct header format: `Authorization: Bearer TOKEN`

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Bcryptjs** - Password hashing
- **JWT** - Token authentication
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **CORS** - Cross-origin support

## Performance Considerations

- JWT tokens: 7-day expiration
- Password salt rounds: 10 (balance security/speed)
- Email unique index for fast lookups
- Timestamps for audit trail

## Production Checklist

- [ ] Change JWT_SECRET to strong key
- [ ] Use HTTPS for all endpoints
- [ ] Set NODE_ENV=production
- [ ] Enable secure cookies (secure flag)
- [ ] Whitelist FRONTEND_URL
- [ ] Use MongoDB Atlas connection
- [ ] Enable database backups
- [ ] Setup logging/monitoring
- [ ] Configure rate limiting
- [ ] Setup error tracking (Sentry, etc)

## Future Enhancements

- Refresh token rotation
- Email verification
- Password reset flow
- 2FA implementation
- OAuth integration
- Rate limiting
- Request logging
- Database migrations

## License

ISC

## Support

For issues or questions, refer to:
1. POSTMAN_GUIDE.md - API testing
2. IMPLEMENTATION_GUIDE.md - Setup & architecture
3. Console logs for debugging
4. Error messages in API responses

---

**Version:** 1.0.0  
**Sprint:** 2 - Authentication Flow  
**Last Updated:** January 2024

