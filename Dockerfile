# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 1088

# Set environment variables
ENV NODE_ENV=production
ENV EPISODE_MANAGER_API_URL=http://host.docker.internal:8000/api/episode-manager
ENV MCP_PORT=1088

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1088/mcp', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Run the HTTP server (not the stdio server)
CMD ["node", "dist/server-http.js"]