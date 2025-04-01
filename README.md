
# VideoFlux - Video Streaming App

A streamlined application for downloading videos from Google Drive and streaming them to Facebook/YouTube using FFmpeg without encoding.

## Features

- System resource monitoring (CPU, Memory, Disk usage)
- Video download from Google Drive
- Streaming to Facebook/YouTube platforms
- Scheduling streams with configurable duration or infinite looping
- Video management (rename, delete)
- Responsive design for all devices

## Local Development

**Requirements:**
- Node.js & npm - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project directory
cd videoflux

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment to Ubuntu VPS

### Prerequisites

- An Ubuntu VPS (18.04 LTS or newer recommended)
- SSH access to your VPS
- A domain name (optional but recommended)

### Step 1: Initial Server Setup

Connect to your VPS:

```sh
ssh username@your_server_ip
```

Update the system:

```sh
sudo apt update
sudo apt upgrade -y
```

Install essential packages:

```sh
sudo apt install -y build-essential curl git
```

### Step 2: Install Node.js using NVM

```sh
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"

# Install latest LTS version of Node.js
nvm install --lts

# Verify installation
node --version
npm --version
```

### Step 3: Install FFmpeg

```sh
sudo apt install -y ffmpeg

# Verify installation
ffmpeg -version
```

### Step 4: Clone and Setup the Application

```sh
# Clone the repository
git clone <YOUR_REPOSITORY_URL> videoflux
cd videoflux

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 5: Install and Configure PM2 (Process Manager)

```sh
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "videoflux" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

### Step 6: Setup Nginx as a Reverse Proxy (Optional but recommended)

```sh
# Install Nginx
sudo apt install -y nginx

# Configure firewall to allow Nginx
sudo ufw allow 'Nginx Full'

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/videoflux
```

Add the following configuration (replace with your domain if available):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Or your server IP if no domain

    location / {
        proxy_pass http://localhost:3000;  # Adjust if your app runs on a different port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```sh
sudo ln -s /etc/nginx/sites-available/videoflux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt (Optional but recommended)

```sh
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 8: Configure Environment Variables (if needed)

```sh
# Create an environment file
nano .env
```

Add any necessary environment variables to the file.

### Step 9: Verify Installation

Visit your domain or server IP in a web browser to confirm the application is working correctly.

## Usage Instructions

1. **Download Videos**: Navigate to the Download section to fetch videos from Google Drive.
2. **Stream Videos**: Go to the Live Streaming section to configure and start streaming to Facebook/YouTube.
3. **Monitor System Resources**: View CPU, memory, and disk usage at the top of the application.

## Troubleshooting

- **Streaming Issues**: Verify FFmpeg is installed correctly with `ffmpeg -version`.
- **Application Not Starting**: Check PM2 logs with `pm2 logs videoflux`.
- **Permission Errors**: Ensure proper file permissions with `chmod -R 755 /path/to/videoflux`.

## Project Structure

- `/src` - Application source code
- `/public` - Static assets
- `/dist` - Production build files (after running `npm run build`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
