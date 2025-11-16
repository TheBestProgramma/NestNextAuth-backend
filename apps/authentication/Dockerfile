FROM node:20-alpine AS base

# Set CI environment variable for pnpm
ENV CI=true

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files (lock file will be copied with source code if it exists)
COPY package.json ./

# Copy source code (includes pnpm-lock.yaml if it exists, excludes node_modules via .dockerignore)
COPY . .

# Install dependencies
# Try to use lock file if it exists, otherwise install normally
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install --force; \
    fi

# Build stage
FROM base AS build

# Build the authentication app
RUN pnpm build authentication

# Production stage
FROM node:20-alpine AS production

# Set CI environment variable for pnpm
ENV CI=true

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built application and dependencies from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 3001

# Run the application
CMD ["node", "dist/apps/authentication/main"]

