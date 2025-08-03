#!/bin/bash

set -e

# === CONFIGURABLE VALUES ===
LINK_VALUE="${1:-http://localhost:8080}"
SENDGRID_API_KEY="${2:-SG.123}"
DOMAIN="newsletterx.mangopulse.net"

# === UPDATE & INSTALL DEPENDENCIES ===
sudo apt update

# Install Docker
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  sudo apt install -y docker.io
  sudo systemctl enable docker
  sudo systemctl start docker
fi

# Install Docker Compose (v2 plugin style)
if ! command -v docker-compose &> /dev/null; then
  echo "Installing Docker Compose..."
  sudo apt install -y docker-compose
fi

# Install Java 21
if ! java -version 2>&1 | grep '21' &> /dev/null; then
  echo "Installing Java 21..."
  sudo apt install -y wget unzip
  wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb
  sudo dpkg -i jdk-21_linux-x64_bin.deb
  rm jdk-21_linux-x64_bin.deb
fi

# Install Maven
if ! command -v mvn &> /dev/null; then
  echo "Installing Maven..."
  sudo apt install -y maven
fi

ls

# === UPDATE DOCKER COMPOSE ENV VARIABLE ===
echo "Updating NEXT_PUBLIC_BACKEND_URL in docker-compose.yaml..."
sed -i "s|NEXT_PUBLIC_BACKEND_URL: .*|NEXT_PUBLIC_BACKEND_URL: ${LINK_VALUE}|" docker-compose.yaml

# === BUILD THE BACKEND ===
echo "Packaging Java backend with Maven..."
cd api
mvn clean package
cd ..

# === RUN DOCKER COMPOSE ===
echo "Running Docker Compose..."
sudo docker-compose up -d --build

# === WAIT FOR BACKEND TO BE AVAILABLE ===
echo "Waiting for backend to return an empty JSON object from /vars/get-vars..."

until curl -s "${LINK_VALUE}/vars/get-vars" | grep -q '^{[[:space:]]*}$'; do
  echo "Waiting for backend at ${LINK_VALUE}..."
  sleep 5
done

echo "✅ Backend is up and responding."



# === CALL VARIABLE APIs ===
echo "Updating backend variables..."
curl -s "${LINK_VALUE}/vars/update-var?key=LINK&value=${LINK_VALUE}"
echo ""
curl -s "${LINK_VALUE}/vars/update-var?key=SENDGRID_API_KEY&value=${SENDGRID_API_KEY}"
echo ""
curl -s "${LINK_VALUE}/vars/refresh-vars"
echo ""

# === INSTALL & CONFIGURE NGINX ===
echo "Installing Nginx..."
sudo apt install -y nginx

echo "Configuring Nginx for domain $DOMAIN..."

NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/$DOMAIN"
sudo nginx -t && sudo systemctl restart nginx

echo "✅ Deployment complete. Frontend is mapped to: http://$DOMAIN"
