# Run the containers
docker-compose -f docker-compose.dev.yaml up -d

# Check if the containers are running
docker-compose -f docker-compose.dev.yaml ps

# Run the backend
cd api
echo "🚀 Starting NewsletterX API in development mode..."
echo "📧 Email service will be skipped for development"
SKIP_EMAIL_SERVICE=true SENDGRID_API_KEY=SG.dev_key.for_development mvn spring-boot:run


# Run the frontend
cd ui
npm install
npm run dev