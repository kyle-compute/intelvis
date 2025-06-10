# frontend/Dockerfile

# 1. Use an official Node.js image
FROM node:20-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the frontend code
COPY . .

# 5. Expose the port for the dev server
EXPOSE 3000

# 6. Command to start the dev server
CMD ["npm", "run", "dev"]