# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
