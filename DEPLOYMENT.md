# 🚀 Udyam Registration Portal - Production Deployment Guide

This guide provides complete instructions for deploying the Udyam Registration Portal to production.

## 📋 Prerequisites

- **Docker & Docker Compose** installed
- **Git** installed
- **Server** with at least 2GB RAM, 20GB storage
- **Domain name** (optional, for SSL)
- **Basic Linux knowledge**

## 🎯 Deployment Options

### Option 1: One-Click Docker Deployment (Recommended)

This is the fastest way to deploy the entire application stack.

#### Step 1: Clone Repository
```bash
git clone https://github.com/shashi0808/udyam-registration-portal.git
cd udyam-registration-portal
```

#### Step 2: Configure Environment
```bash
# Copy and edit environment file
cp .env.production .env.production.local

# Edit the file with your settings
nano .env.production.local
```

**Important**: Change these values in `.env.production.local`:
- `DB_PASSWORD` - Strong database password
- `JWT_SECRET` - Strong JWT secret (32+ characters)
- `REDIS_PASSWORD` - Strong Redis password
- `FRONTEND_URL` - Your domain URL
- `NEXT_PUBLIC_API_URL` - Your backend API URL

#### Step 3: Deploy
```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh deploy
```

#### Step 4: Verify Deployment
```bash
# Check status
./deploy.sh status

# View logs
./deploy.sh logs
```

Your application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Full Stack**: http://localhost:80

### Option 2: Cloud Platform Deployment

#### A. Vercel + Railway (Easiest for beginners)

**Deploy Backend to Railway:**
1. Go to [Railway.app](https://railway.app)
2. Connect GitHub account
3. Create new project from GitHub repo
4. Select backend service
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[Railway will provide PostgreSQL URL]
   JWT_SECRET=your-super-secure-jwt-secret
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

**Deploy Frontend to Vercel:**
1. Go to [Vercel.com](https://vercel.com)
2. Import from GitHub
3. Set root directory to `udyam-registration`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app/api
   ```

#### B. DigitalOcean Droplet

**Create Droplet:**
```bash
# Create Ubuntu 20.04 droplet (minimum $10/month)
# SSH into server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
pip3 install docker-compose

# Clone and deploy
git clone https://github.com/shashi0808/udyam-registration-portal.git
cd udyam-registration-portal
cp .env.production .env.production.local
# Edit .env.production.local with your settings
nano .env.production.local
./deploy.sh deploy
```

#### C. AWS EC2

**Launch EC2 Instance:**
```bash
# Launch Ubuntu 20.04 instance (t3.small minimum)
# Configure security groups: 80, 443, 22

# SSH and setup
ssh -i your-key.pem ubuntu@your-instance-ip
sudo apt update && sudo apt install -y docker.io docker-compose git
sudo usermod -aG docker ubuntu
newgrp docker

# Deploy
git clone https://github.com/shashi0808/udyam-registration-portal.git
cd udyam-registration-portal
cp .env.production .env.production.local
# Configure environment
nano .env.production.local
./deploy.sh deploy
```

## 🔒 SSL Setup (HTTPS)

### Option 1: Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Cloudflare (Recommended)
1. Add domain to Cloudflare
2. Enable "Full (strict)" SSL
3. Update DNS to point to your server
4. Enable "Always Use HTTPS"

## 🗄️ Database Management

### Backup Database
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U udyam_user udyam_registration > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U udyam_user udyam_registration < backup_file.sql
```

### Database Migration
```bash
# Access database
docker-compose -f docker-compose.prod.yml exec postgres psql -U udyam_user -d udyam_registration

# Run SQL commands
\l                    # List databases
\dt                   # List tables
\d table_name         # Describe table
```

## 📊 Monitoring & Logging

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Monitor Resources
```bash
# Container stats
docker stats

# Service health
./deploy.sh status
```

### Log Rotation
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/docker
```
Add:
```
/var/lib/docker/containers/*/*-json.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
```

## 🔧 Maintenance Commands

```bash
# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Update application
git pull origin master
./deploy.sh deploy

# Clean unused Docker resources
docker system prune -a

# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U udyam_user udyam_registration > backup.sql
```

## 🚨 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
sudo netstat -tulpn | grep :3000
sudo kill -9 [PID]
```

**2. Database Connection Failed**
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres
```

**3. Frontend Not Loading**
```bash
# Check frontend logs
docker-compose -f docker-compose.prod.yml logs frontend

# Rebuild frontend
docker-compose -f docker-compose.prod.yml up --build frontend
```

**4. API Requests Failing**
```bash
# Check CORS settings in .env.production.local
# Verify NEXT_PUBLIC_API_URL is correct
# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend
```

### Performance Optimization

**1. Enable Nginx Gzip**
Already configured in `nginx.prod.conf`

**2. Database Indexing**
```sql
-- Connect to database and add indexes
CREATE INDEX idx_aadhaar ON registrations(aadhaar_number);
CREATE INDEX idx_pan ON registrations(pan_number);
CREATE INDEX idx_created_at ON registrations(created_at);
```

**3. Redis Caching**
Already configured in production setup

**4. Container Resource Limits**
```yaml
# Add to docker-compose.prod.yml services
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
```

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (UFW/iptables)
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity
- [ ] Use non-root database user
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Regular dependency updates

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale services
docker-compose -f docker-compose.prod.yml up --scale backend=3 --scale frontend=2
```

### Load Balancer (Nginx)
Configure multiple upstream servers in `nginx.prod.conf`

### Database Scaling
- Use read replicas for PostgreSQL
- Implement connection pooling
- Consider managed database services

## 📞 Support

For deployment issues:
- Check logs: `./deploy.sh logs`
- GitHub Issues: [Repository Issues](https://github.com/shashi0808/udyam-registration-portal/issues)
- Review this documentation

## 📋 Production Checklist

Before going live:
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Security hardening complete
- [ ] Performance testing done
- [ ] Error tracking configured
- [ ] DNS configured
- [ ] Firewall rules set
- [ ] Admin access secured

---

**🎉 Congratulations! Your Udyam Registration Portal is now live!**

Access your application at your configured domain or server IP address.