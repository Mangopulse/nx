# Use official Node.js image for building
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy the rest of your app
COPY . .

# Accept build-time arguments for Next.js public environment variables
ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_IS_LOCAL

# Set environment variables for the build
ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_IS_LOCAL=$NEXT_PUBLIC_IS_LOCAL

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json for production dependencies install
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public

# Switch to non-root user
USER nextjs

# Expose the Next.js production port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the production server
CMD ["npm", "start"]
