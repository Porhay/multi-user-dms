FROM node:alpine AS client
WORKDIR /app

COPY package*.json ./
COPY public/ ./public
COPY src/ ./src

RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
