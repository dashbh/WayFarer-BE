# Dockerfile for wayfarer-auth
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the project (optional, if using TypeScript)
# RUN npm run build

# Expose the port the service will run on
EXPOSE 3001

# Start the service
CMD ["npm", "run", "start:auth"]
