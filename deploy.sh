#!/bin/bash

# Udyam Registration Portal - Production Deployment Script
# This script handles the complete deployment process

set -e

echo "🚀 Starting Udyam Registration Portal Deployment..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo -e "${YELLOW}📝 Please copy .env.production.example to .env.production and configure it${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Loading environment variables...${NC}"
source .env.production

# Validate required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "REDIS_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"CHANGE_THIS"* ]]; then
        echo -e "${RED}❌ Please set $var in .env.production${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to build and deploy
deploy() {
    echo -e "${BLUE}🏗️ Building and starting services...${NC}"
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Build and start services
    docker-compose -f docker-compose.prod.yml up --build -d
    
    echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
    
    # Wait for database to be ready
    echo -e "${YELLOW}🗄️ Waiting for database...${NC}"
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Database is ready${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Database not ready, waiting... (${timeout}s remaining)${NC}"
        sleep 5
        timeout=$((timeout-5))
    done
    
    if [ $timeout -eq 0 ]; then
        echo -e "${RED}❌ Database failed to start within 60 seconds${NC}"
        docker-compose -f docker-compose.prod.yml logs postgres
        exit 1
    fi
    
    # Wait for backend to be ready
    echo -e "${YELLOW}🔧 Waiting for backend API...${NC}"
    timeout=90
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:${BACKEND_PORT:-5000}/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend API is ready${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Backend not ready, waiting... (${timeout}s remaining)${NC}"
        sleep 5
        timeout=$((timeout-5))
    done
    
    if [ $timeout -eq 0 ]; then
        echo -e "${RED}❌ Backend failed to start within 90 seconds${NC}"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi
    
    # Wait for frontend to be ready
    echo -e "${YELLOW}🎨 Waiting for frontend...${NC}"
    timeout=90
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:${FRONTEND_PORT:-3000} > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is ready${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Frontend not ready, waiting... (${timeout}s remaining)${NC}"
        sleep 5
        timeout=$((timeout-5))
    done
    
    if [ $timeout -eq 0 ]; then
        echo -e "${RED}❌ Frontend failed to start within 90 seconds${NC}"
        docker-compose -f docker-compose.prod.yml logs frontend
        exit 1
    fi
}

# Function to show deployment status
show_status() {
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo "=================================="
    echo ""
    echo -e "${BLUE}📍 Service URLs:${NC}"
    echo -e "   🌐 Frontend:  http://localhost:${FRONTEND_PORT:-3000}"
    echo -e "   🔧 Backend:   http://localhost:${BACKEND_PORT:-5000}"
    echo -e "   🗄️ Database:  localhost:${DB_PORT:-5432}"
    echo -e "   🚀 Nginx:     http://localhost:${HTTP_PORT:-80}"
    echo ""
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo -e "${BLUE}🔍 Health Checks:${NC}"
    echo -e "   Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:${FRONTEND_PORT:-3000})"
    echo -e "   Backend:  $(curl -s -o /dev/null -w "%{http_code}" http://localhost:${BACKEND_PORT:-5000}/health)"
    echo -e "   Nginx:    $(curl -s -o /dev/null -w "%{http_code}" http://localhost:${HTTP_PORT:-80})"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo "   1. Configure your domain DNS to point to this server"
    echo "   2. Set up SSL certificates for HTTPS"
    echo "   3. Configure firewall rules if needed"
    echo "   4. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📄 Recent logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs --tail=20
}

# Function to stop deployment
stop_deployment() {
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    docker-compose -f docker-compose.prod.yml down
    echo -e "${GREEN}✅ All services stopped${NC}"
}

# Function to restart deployment
restart_deployment() {
    echo -e "${YELLOW}🔄 Restarting all services...${NC}"
    docker-compose -f docker-compose.prod.yml restart
    echo -e "${GREEN}✅ All services restarted${NC}"
}

# Main deployment logic
case "${1:-deploy}" in
    "deploy")
        check_docker
        deploy
        show_status
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_deployment
        ;;
    "restart")
        restart_deployment
        ;;
    "help"|"--help"|"-h")
        echo "Udyam Registration Portal Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy the application (default)"
        echo "  status   - Show deployment status"
        echo "  logs     - Show recent logs"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  help     - Show this help message"
        echo ""
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac