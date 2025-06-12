# 1. Start with an official Node.js image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies first
# This caches this layer, so 'npm install' doesn't run every time you change code
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your backend code (including prisma schema)
COPY . .

# 5. Generate the Prisma Client (after copying all files)
RUN npx prisma generate

# 6. Expose the port the app will run on
EXPOSE 3001

# 7. Define the command to start your app
# Note: docker-compose.prod.yml overrides this anyway
CMD ["node", "index.js"]