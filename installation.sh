version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: nx_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: root
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: 22_9c£Q>a-[n
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - app-network

  backend:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/nx_db
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build:
      context: ./ui
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://localhost:8080
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge
