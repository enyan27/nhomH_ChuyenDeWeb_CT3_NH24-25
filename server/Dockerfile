FROM node:14
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Server API -> http://localhost:8080
EXPOSE 8080
CMD ["node", "server.js"]