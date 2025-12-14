# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Copy built output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Run the server
CMD ["bun", ".output/server/index.mjs"]
