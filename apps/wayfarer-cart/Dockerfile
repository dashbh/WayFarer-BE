# Dockerfile for wayfarer-cart
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY libs ./libs
COPY package*.json ./
COPY apps/wayfarer-cart ./apps/wayfarer-cart
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the project (optional, if using TypeScript)
RUN npm run build:wayfarer-cart

# Expose the port the service will run on
EXPOSE 9003

# Start the service
CMD ["npm", "run", "start:cart"]
