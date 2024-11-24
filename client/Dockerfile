FROM node:14
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Client -> http://localhost:3000
EXPOSE 3000
CMD ["npm", "start"]