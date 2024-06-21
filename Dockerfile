# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the application
CMD [ "npm", "start" ]