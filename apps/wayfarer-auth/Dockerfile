# Dockerfile for wayfarer-auth
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project (optional, if using TypeScript)
RUN npm run build

# Expose the port the service will run on
EXPOSE 3001

# Start the service
CMD ["npm", "run", "start:auth"]
