FROM node:alpine AS server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
VOLUME /data
EXPOSE 8000
CMD npm start