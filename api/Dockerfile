# Use Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (for better caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use Eclipse Temurin for runtime
FROM eclipse-temurin:21-jre

# Set working directory inside container
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/newsletterx-*.jar app.jar

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
