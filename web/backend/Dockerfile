# backend/Dockerfile

# 1. Start with an official Node.js image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies first
# This caches this layer, so 'npm install' doesn't run every time you change code
COPY package*.json ./
RUN npm install

# 4. Copy the Prisma schema
COPY prisma ./prisma/

# 5. Generate the Prisma Client
RUN npx prisma generate

# 6. Copy the rest of your backend code
COPY . .

# 7. Expose the port the app will run on
EXPOSE 3001

# 8. Define the command to start your app
CMD [ "node", "index.js" ]