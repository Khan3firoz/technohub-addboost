# Production Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Test all API endpoints locally
- [ ] Review security settings
- [ ] Set production environment variables
- [ ] Configure production database
- [ ] Update CORS origins
- [ ] Set secure JWT secrets
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Test file uploads
- [ ] Review error handling

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free Tier is fine for starting)

### 2. Configure Database

1. **Create Database User:**
   - Database Access → Add New Database User
   - Choose username and strong password
   - Grant "Atlas Admin" or custom role

2. **Whitelist IP Addresses:**
   - Network Access → Add IP Address
   - For testing: Allow Access from Anywhere (0.0.0.0/0)
   - For production: Add specific server IPs

3. **Get Connection String:**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/adcampaign`

### 3. Database Indexes

Indexes are automatically created by the application on first run.

## 🖥️ Backend Deployment

### Option 1: Railway

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize Project:**
```bash
cd server
railway init
```

4. **Set Environment Variables:**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="your_mongodb_atlas_uri"
railway variables set JWT_ACCESS_SECRET="your_secure_secret"
railway variables set JWT_REFRESH_SECRET="your_secure_refresh_secret"
railway variables set CORS_ORIGIN="https://your-frontend-domain.com"
```

5. **Deploy:**
```bash
railway up
```

6. **Get Domain:**
```bash
railway domain
```

### Option 2: Heroku

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Login:**
```bash
heroku login
```

3. **Create App:**
```bash
cd server
heroku create your-app-name
```

4. **Set Environment Variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_ACCESS_SECRET="your_secure_secret"
heroku config:set JWT_REFRESH_SECRET="your_secure_refresh_secret"
heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
```

5. **Add Procfile:**
```bash
echo "web: npm start" > Procfile
```

6. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `server` directory as source
3. Set build command: `npm install && npm run build`
4. Set run command: `npm start`
5. Add environment variables in the UI
6. Deploy

### Option 4: AWS EC2 / VPS

1. **SSH into Server:**
```bash
ssh user@your-server-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2:**
```bash
sudo npm install -g pm2
```

4. **Clone Repository:**
```bash
git clone your-repo-url
cd technohub-addboost/server
```

5. **Install Dependencies:**
```bash
npm install
```

6. **Build:**
```bash
npm run build
```

7. **Create .env file:**
```bash
nano .env
# Add all production environment variables
```

8. **Start with PM2:**
```bash
pm2 start dist/server.js --name adcampaign-api
pm2 save
pm2 startup
```

9. **Setup Nginx (Optional):**
```bash
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/adcampaign

# Add:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/adcampaign /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL (Let's Encrypt):**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🌐 Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Configure Environment Variable:**
```bash
cd client
echo "VITE_API_URL=https://your-backend-domain.com/api/v1" > .env.production
```

4. **Deploy:**
```bash
vercel
```

5. **Add Environment Variable in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-domain.com/api/v1`

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Build:**
```bash
cd client
npm run build
```

4. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

5. **Configure Environment:**
   - Site Settings → Build & Deploy → Environment
   - Add: `VITE_API_URL` = `https://your-backend-domain.com/api/v1`

### Option 3: GitHub Pages (Static Only)

Not recommended for this project as it requires a backend API.

## 🔒 Production Security Checklist

### Environment Variables
- [ ] Use strong, random JWT secrets (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Secure MongoDB connection string
- [ ] Update CORS_ORIGIN to production domain
- [ ] Set appropriate rate limits

### JWT Secrets Generation
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Database Security
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable authentication
- [ ] Restrict IP addresses
- [ ] Use strong passwords
- [ ] Enable encryption at rest
- [ ] Regular backups

### Application Security
- [ ] HTTPS enabled
- [ ] Helmet middleware (already included)
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Input validation on all endpoints
- [ ] File upload restrictions
- [ ] Error messages don't leak sensitive info

### Monitoring
- [ ] Set up error logging (Winston already configured)
- [ ] Monitor API performance
- [ ] Track database queries
- [ ] Set up uptime monitoring
- [ ] Configure alerts

## 📊 Monitoring & Logging

### Application Logs

Production logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

### Log Management Services

**Option 1: LogRocket**
```bash
npm install logrocket
```

**Option 2: Sentry**
```bash
npm install @sentry/node
```

Add to `server.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

**Option 3: PM2 Logs (VPS)**
```bash
pm2 logs adcampaign-api
pm2 logs adcampaign-api --lines 100
```

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com/
- **Pingdom**: https://www.pingdom.com/
- **StatusCake**: https://www.statuscake.com/

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          cd server
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          cd client
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Pre-Deployment Testing

```bash
# Run production build locally
cd server
NODE_ENV=production npm run build
NODE_ENV=production npm start

# Test endpoints
curl https://your-domain.com/api/v1/health
curl https://your-domain.com/api-docs
```

## 📈 Performance Optimization

### Backend
- [ ] Enable compression (already included)
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Use CDN for static files
- [ ] Enable HTTP/2

### Database
- [ ] Indexes created (automatic)
- [ ] Connection pooling configured
- [ ] Query optimization
- [ ] Regular maintenance

### File Uploads
- [ ] Use S3 or CloudFlare R2 for storage (optional)
- [ ] Set appropriate file size limits
- [ ] Compress images before upload

## 🔐 SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Cloudflare (Free SSL)
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full mode)

## 🌍 Environment Variables Reference

### Production Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/adcampaign
JWT_ACCESS_SECRET=your_secure_64_char_secret
JWT_REFRESH_SECRET=your_secure_64_char_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://your-frontend-domain.com
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

## 🚨 Troubleshooting

### Issue: 502 Bad Gateway
- Check if server is running
- Verify PORT configuration
- Check Nginx proxy settings

### Issue: CORS Errors
- Verify CORS_ORIGIN matches frontend domain
- Check HTTPS/HTTP protocol match

### Issue: MongoDB Connection
- Verify connection string
- Check IP whitelist
- Verify credentials

### Issue: High Memory Usage
- Monitor with `pm2 monit`
- Check for memory leaks
- Optimize queries

## 📱 Post-Deployment

1. **Test All Endpoints:**
   - Use Swagger UI
   - Test authentication flow
   - Create test campaign
   - Upload test file

2. **Monitor Logs:**
   ```bash
   pm2 logs
   tail -f logs/error.log
   ```

3. **Set Up Backups:**
   - MongoDB Atlas automatic backups
   - Or manual backup script

4. **Document API URL:**
   - Share with frontend team
   - Update documentation

## 🎯 Production Checklist Summary

- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] Backend deployed and running
- [ ] Frontend deployed and connected
- [ ] SSL certificate installed
- [ ] CORS configured correctly
- [ ] API documentation accessible
- [ ] First admin user created
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Error logging active
- [ ] Performance optimized

---

**Congratulations!** 🎉 Your production deployment is complete!

