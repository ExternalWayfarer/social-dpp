# Используем Node.js для сборки фронтенда
FROM node:20.18.0 AS builder


# working directory
WORKDIR /app-frontend

# copy package.json and package-lock.json for dependencies
COPY package*.json ./

# instal deps
RUN npm install

# copy other code
COPY . .


# RRUN VITE SERV
CMD ["npm", "run", "dev"]
