# Use the latest Node.js runtime as a base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application's default port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "start"]
