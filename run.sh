# Run the containers
docker-compose -f docker-compose.dev.yaml up -d

# Check if the containers are running
docker-compose -f docker-compose.dev.yaml ps

# Run the backend
cd api
mvn spring-boot:run


# Run the frontend
cd ui
npm install
npm run dev