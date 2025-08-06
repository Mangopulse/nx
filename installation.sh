#!/bin/bash

set -e

# === CONFIGURABLE VALUES ===
LINK_VALUE="${1:-http://localhost:8080}"
SENDGRID_API_KEY="${2:-SG.123}"
DOMAIN="newsletterx.mangopulse.net"

# === UPDATE & INSTALL DEPENDENCIES ===
echo "📦 Updating apt..."
sudo apt update

# === Install Docker ===
if ! command -v docker &> /dev/null; then
  echo "🐳 Installing Docker..."
  sudo apt remove -y docker docker-engine docker.io containerd runc || true
  sudo apt install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo systemctl enable docker
  sudo systemctl start docker
else
  echo "✅ Docker already installed."
fi

# === Install Node.js 18 ===
if ! command -v node &> /dev/null || ! node -v | grep -q 'v18'; then
  echo "🟢 Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo "✅ Node.js 18 already installed."
fi

# === Install Java 21 ===
if ! java -version 2>&1 | grep '21' &> /dev/null; then
  echo "☕ Installing Java 21..."
  sudo apt install -y wget unzip
  wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb
  sudo dpkg -i jdk-21_linux-x64_bin.deb
  rm jdk-21_linux-x64_bin.deb
else
  echo "✅ Java 21 already installed."
fi

# === Install Maven ===
if ! command -v mvn &> /dev/null; then
  echo "📦 Installing Maven..."
  sudo apt install -y maven
else
  echo "✅ Maven already installed."
fi

# === BUILD BACKEND ===
echo "🛠 Building Java backend..."
cd api
mvn clean package -DskipTests
cd ..

# === BUILD FRONTEND ===
echo "🧱 Building Next.js frontend..."
cd ui
npm install
npm run build
cd ..

# === START SERVICES ===
echo "🐳 Running Docker Compose..."
docker compose up -d --build

# === WAIT FOR BACKEND TO BE AVAILABLE ===
echo "⏳ Waiting for backend to return an empty JSON object from /vars/get-vars..."

until curl -s "${LINK_VALUE}/vars/get-vars" | grep -q '^{[[:space:]]*}$'; do
  echo "⏳ Waiting for backend at ${LINK_VALUE}..."
  sleep 5
done

echo "✅ Backend is up and responding."

# === CALL VARIABLE APIs ===
echo "🔁 Updating backend variables..."
curl -s "${LINK_VALUE}/vars/update-var?key=LINK&value=${LINK_VALUE}"
echo ""
curl -s "${LINK_VALUE}/vars/update-var?key=SENDGRID_API_KEY&value=${SENDGRID_API_KEY}"
echo ""
curl -s "${LINK_VALUE}/vars/refresh-vars"
echo ""

# === INSTALL & CONFIGURE NGINX ===
echo "🌐 Installing NGINX..."
sudo apt install -y nginx

echo "🔧 Configuring NGINX for domain $DOMAIN..."

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
