# Dockerfile for api-gateway
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY libs ./libs
COPY package*.json ./
COPY apps/api-gateway ./apps/api-gateway
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the project (optional, if using TypeScript)
RUN npm run build:api-gateway

# Expose the port the service will run on
EXPOSE 9000

# Start the service
CMD ["npm", "run", "start:gateway"]
