# Use Java 21 as the base image
FROM openjdk:21

# Set working directory inside container
WORKDIR /app

# Copy the built jar file into the container
COPY target/newsletterx-*.jar app.jar

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
