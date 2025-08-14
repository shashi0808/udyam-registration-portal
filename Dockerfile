# Multi-stage Dockerfile for Udyam Registration Application

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY udyam-registration/package*.json ./
RUN npm install

# Copy frontend source code
COPY udyam-registration ./

# Build the frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend ./

# Build the backend
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy backend build
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/dist ./backend/
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/package*.json ./backend/
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/.env ./backend/

# Copy frontend build
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --only=production

# Create startup script
WORKDIR /app
COPY --chown=nextjs:nodejs <<EOF /app/start.sh
#!/bin/sh
set -e

echo "Starting Udyam Registration Application..."

# Start backend in background
cd /app/backend
echo "Starting backend server..."
node index.js &
BACKEND_PID=\$!

# Start frontend
cd /app/frontend
echo "Starting frontend server..."
node server.js &
FRONTEND_PID=\$!

# Wait for both processes
wait \$BACKEND_PID
wait \$FRONTEND_PID
EOF

RUN chmod +x /app/start.sh

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_PORT=5000

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]