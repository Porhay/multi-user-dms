FROM node:14-alpine AS builder

# Enviroment
ENV NODE_ENV production

ARG REACT_APP_NODE_ENV
ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV

ARG REACT_APP_EXTERNAL_SERVER_URL
ENV REACT_APP_EXTERNAL_SERVER_URL $REACT_APP_EXTERNAL_SERVER_URL

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package*.json ./
RUN npm i

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production

# Enviroment
ENV NODE_ENV production

ARG REACT_APP_NODE_ENV
ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV

ARG REACT_APP_EXTERNAL_SERVER_URL
ENV REACT_APP_EXTERNAL_SERVER_URL $REACT_APP_EXTERNAL_SERVER_URL

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
