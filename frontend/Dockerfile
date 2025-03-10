# Используем Node.js для сборки фронтенда
FROM node:20.18.0 AS builder


# Устанавливаем рабочую директорию
WORKDIR /app-frontend

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код проекта
COPY . .


# Запускаем сервер разработки Vite
CMD ["npm", "run", "dev"]
