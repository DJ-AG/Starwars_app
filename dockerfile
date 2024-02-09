# Specify the node base image with your desired version node:<version>
FROM node:16-alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the code to the container
COPY . .

# Build the application for production
RUN npm run build

# Install a simple http server for serving static content
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Serve the app using serve from the dist directory
CMD ["serve", "-s", "dist", "-l", "3000"]