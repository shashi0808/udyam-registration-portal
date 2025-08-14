# Udyam Registration Portal

A comprehensive, responsive web application that replicates the Udyam registration process with modern technologies. This project includes web scraping, frontend development, backend API, and containerization.

![Udyam Registration](https://img.shields.io/badge/Status-Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4-lightgrey)

## 🚀 Features

### ✅ Completed Features

- **Web Scraping**: Extracted form fields, validation rules, and UI structure from Udyam portal
- **Responsive UI**: Pixel-perfect, mobile-first responsive design using Next.js and Tailwind CSS
- **Form Validation**: Real-time validation with proper error messages
- **Progress Tracker**: Step-by-step progress indicator
- **Auto-fill**: PIN code based city/state lookup
- **Backend API**: RESTful API with Express.js and TypeScript
- **Database Design**: PostgreSQL schema for data storage
- **Unit Tests**: Comprehensive test coverage
- **Containerization**: Docker and Docker Compose setup

### 🎯 Key Functionalities

1. **Step 1: Aadhaar Verification**
   - 12-digit Aadhaar number input with validation
   - OTP generation and verification
   - Real-time format validation

2. **Step 2: PAN Details & Personal Information**
   - PAN number validation (5 letters + 4 digits + 1 letter)
   - Personal details form
   - Auto-fill city/state based on PIN code
   - Mobile number and email validation

3. **Backend Services**
   - RESTful API endpoints
   - Request validation and sanitization
   - Rate limiting and security headers
   - Error handling and logging

## 📁 Project Structure

```
Openbiz/
├── udyam-registration/          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App router
│   │   ├── components/          # React components
│   │   │   ├── ui/              # UI components
│   │   │   ├── Step1Form.tsx    # Aadhaar verification
│   │   │   ├── Step2Form.tsx    # PAN details
│   │   │   └── ProgressTracker.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities and API
│   │   ├── types/               # TypeScript types
│   │   └── data/                # Form structure data
│   └── public/                  # Static assets
├── backend/                     # Express.js Backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   └── tests/                   # Unit tests
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Container orchestration
├── init.sql                     # Database initialization
└── README.md                    # This file
```

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching (optional)
- **Jest** - Testing framework
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose (for containerized setup)
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Openbiz
   ```

2. **Start Frontend (Terminal 1)**
   ```bash
   cd udyam-registration
   npm install
   npm run dev
   ```
   Frontend will be available at http://localhost:3000

3. **Start Backend (Terminal 2)**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend will be available at http://localhost:5000

### Docker Setup (Recommended for Production)

1. **Using Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Start in background
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down
   ```

2. **Services Available**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379 (optional)

## 📊 API Endpoints

### Health Check
- `GET /health` - Service health status

### Registration APIs
- `POST /api/v1/send-otp` - Send OTP to Aadhaar number
- `POST /api/v1/verify-otp` - Verify OTP
- `POST /api/v1/validate-pan` - Validate PAN number
- `POST /api/v1/submit-registration` - Submit complete registration
- `GET /api/v1/pin-lookup/:pincode` - Lookup city/state by PIN code

### Example API Usage

```bash
# Send OTP
curl -X POST http://localhost:5000/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"aadhaarNumber": "123456789012"}'

# Verify OTP
curl -X POST http://localhost:5000/api/v1/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"aadhaarNumber": "123456789012", "otp": "123456"}'
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Testing (Optional)
```bash
cd udyam-registration

# Add testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

## 🔒 Security Features

- **Input Validation**: All inputs validated using Zod schemas
- **Rate Limiting**: Configurable rate limiting per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS origins
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Persistence**: Form data persistence across steps

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/udyam
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-super-secure-secret
DEMO_MODE=true
MOCK_OTP=123456
```

## 📈 Performance Optimizations

- **Next.js Optimizations**: Image optimization, code splitting
- **Caching**: Redis for API response caching
- **Database Indexes**: Optimized database queries
- **Compression**: Gzip compression enabled
- **Static Assets**: CDN-ready static asset structure

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Update environment variables for production
   cp .env.example .env.production
   ```

2. **Docker Production Build**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
   ```

3. **Database Migration**
   ```bash
   # Run database migrations
   docker-compose exec backend npm run migrate
   ```

### Deployment Platforms

- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend deployment
- **AWS/GCP/Azure** - Full stack deployment
- **DigitalOcean** - Droplet with Docker

## 📝 Demo Credentials

For testing purposes, use these credentials:

- **Aadhaar Number**: Any 12-digit number (e.g., 123456789012)
- **OTP**: 123456 (demo mode)
- **PAN**: Any valid format (e.g., ABCDE1234F)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Udyam Registration Portal** - Original inspiration
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Express.js Community** - Robust backend framework

## 📞 Support

For support and queries:
- Create an issue in the repository
- Email: support@udyamregistration.demo
- Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**Built with ❤️ using modern web technologies**