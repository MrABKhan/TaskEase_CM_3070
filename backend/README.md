# TaskEase Backend

## Deployment Guide

The backend uses a unified Docker setup that works for both development and production environments. MongoDB is kept internal and only the API is exposed.

### Prerequisites

1. Docker and Docker Compose installed
2. Git installed

### Local Development

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Start the development server:
   ```bash
   docker-compose up
   ```
   This will start the API in development mode with hot-reloading.

### Production Deployment

1. Clone the repository on your production server:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Create a `.env` file:
   ```bash
   # Required
   NODE_ENV=production
   PORT=80  # or 443 for HTTPS

   # Optional - defaults shown
   MONGODB_URI=mongodb://mongo:27017/taskmanager
   ```

3. Start the production server:
   ```bash
   docker-compose up -d
   ```

### Configuration

The setup supports various environment variables:

- `NODE_ENV`: Set to 'production' for production mode, 'development' for development mode
- `PORT`: The port to expose the API on (defaults to 3000)
- `MONGODB_URI`: MongoDB connection string (defaults to internal Docker MongoDB)

### Security Features

1. MongoDB is not exposed to the host - only accessible within Docker network
2. API port is configurable via environment variables
3. Health checks ensure service availability
4. Automatic container restart on failure

### Monitoring

1. Check service status:
   ```bash
   docker-compose ps
   ```

2. View logs:
   ```bash
   docker-compose logs -f api
   ```

3. Check API health:
   ```bash
   curl http://localhost:${PORT}/health
   ```

### Backup and Restore

1. Backup MongoDB data:
   ```bash
   docker-compose exec mongo mongodump --out /data/db/backup
   ```

2. Restore MongoDB data:
   ```bash
   docker-compose exec mongo mongorestore /data/db/backup
   ```

### Common Operations

1. Restart services:
   ```bash
   docker-compose restart
   ```

2. Update to latest version:
   ```bash
   git pull
   docker-compose down
   docker-compose up -d --build
   ```

3. View container resources:
   ```bash
   docker stats
   ```

### Troubleshooting

1. API container not starting:
   - Check logs: `docker-compose logs api`
   - Verify MongoDB is healthy: `docker-compose ps`
   - Check environment variables: `docker-compose config`

2. MongoDB connection issues:
   - Verify network connectivity: `docker network inspect backend_app_network`
   - Check MongoDB logs: `docker-compose logs mongo`

3. Performance issues:
   - Monitor resources: `docker stats`
   - Check API logs for slow queries
   - Consider adding MongoDB indexes

### SSL/HTTPS Setup

For HTTPS support, we recommend using a reverse proxy like Nginx. Example configuration:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
``` 