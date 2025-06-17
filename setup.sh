#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting server setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker is already installed"
fi

# Install Docker Compose
echo "🐋 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed"
fi

# Clone the repository
echo "📥 Cloning the repository..."
if [ ! -d "newsletterx" ]; then
    git clone https://github.com/YOUR_USERNAME/newsletterx.git
    cd newsletterx
else
    echo "Repository already exists, pulling latest changes..."
    cd newsletterx
    git pull
fi

# Setup environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.template .env
    
    # Prompt for domain configuration
    read -p "Enter API domain (e.g., api.example.com): " API_DOMAIN
    read -p "Enter UI domain (e.g., app.example.com): " UI_DOMAIN
    
    # Update .env file with provided domains
    sed -i "s/API_DOMAIN=.*/API_DOMAIN=$API_DOMAIN/" .env
    sed -i "s/UI_DOMAIN=.*/UI_DOMAIN=$UI_DOMAIN/" .env
    
    # Generate random passwords for security
    PG_PASS=$(openssl rand -base64 12)
    GRAFANA_PASS=$(openssl rand -base64 12)
    
    # Update passwords in .env
    sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$PG_PASS/" .env
    sed -i "s/GRAFANA_ADMIN_PASSWORD=.*/GRAFANA_ADMIN_PASSWORD=$GRAFANA_PASS/" .env
else
    echo ".env file already exists, skipping configuration..."
fi

# Create necessary directories for persistent storage
echo "📁 Creating storage directories..."
sudo mkdir -p /var/lib/grafana
sudo mkdir -p /var/lib/prometheus
sudo mkdir -p /var/lib/postgresql

# Set proper permissions
sudo chown -R $USER:$USER /var/lib/grafana
sudo chown -R $USER:$USER /var/lib/prometheus
sudo chown -R $USER:$USER /var/lib/postgresql

# Start the application
echo "🚀 Starting the application..."
docker-compose pull
docker-compose up -d --build

# Wait for services to be up
echo "⏳ Waiting for services to start..."
sleep 30

# Print access information
echo "✨ Setup completed! Here's how to access your services:"
echo "🌐 Application UI: https://${UI_DOMAIN}"
echo "🔄 API: https://${API_DOMAIN}"
echo "📊 Grafana: http://localhost:${GRAFANA_PORT} (admin/${GRAFANA_PASS})"
echo "📈 Prometheus: http://localhost:${PROMETHEUS_PORT}"
echo "📊 PostgreSQL Metrics: http://localhost:${PG_EXPORTER_PORT}"

# Save credentials to a secure file
echo "💾 Saving credentials to credentials.txt..."
cat > credentials.txt << EOF
PostgreSQL:
Username: ${POSTGRES_USER}
Password: ${PG_PASS}

Grafana:
Username: admin
Password: ${GRAFANA_PASS}

Domains:
UI: ${UI_DOMAIN}
API: ${API_DOMAIN}
EOF

chmod 600 credentials.txt

# Print useful commands
echo -e "\n📝 Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Restart services: docker-compose restart"
echo "- Stop services: docker-compose down"
echo "- Update services: ./setup.sh"
echo "- View credentials: cat credentials.txt"

# Make the script executable
chmod +x setup.sh 