# Dockerfile del microservicio CATÁLOGO. Igual que el de la Clase 21.
FROM node:22-alpine
WORKDIR /app

# 1) Solo los manifiestos primero (aprovecha la caché de capas).
COPY package*.json ./
RUN npm install

# 2) El resto del código.
COPY . .

EXPOSE 4001
CMD ["node", "src/server.js"]
