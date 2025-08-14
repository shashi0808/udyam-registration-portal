"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
// Load environment variables
dotenv_1.default.config();
// Import routes
const api_1 = __importDefault(require("./routes/api"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
// Logging
app.use((0, morgan_1.default)('combined'));
// Rate limiting
app.use(rateLimiter_1.rateLimiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API routes
app.use('/api', api_1.default);
// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Udyam Registration Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api/v1'
        }
    });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Create HTTP server
const server = (0, http_1.createServer)(app);
// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    server.close((err) => {
        console.log('HTTP server closed');
        process.exit(err ? 1 : 0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received');
    server.close((err) => {
        console.log('HTTP server closed');
        process.exit(err ? 1 : 0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map