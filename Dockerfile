# Use official Node.js image
FROM node:24.1.0

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose app port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]