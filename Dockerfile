# Use a node base image
FROM node

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
