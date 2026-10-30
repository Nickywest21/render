# Dockerfile del GATEWAY. Igual que el de la Clase 21.
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "src/server.js"]
