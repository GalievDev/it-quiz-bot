# Use Node.js LTS version as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (optional, useful for debugging if needed)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
