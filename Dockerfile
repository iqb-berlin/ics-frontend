FROM node:20.18-bookworm-slim AS builder
WORKDIR /app
COPY package*.json .
COPY tsconfig.* .
COPY angular.json .
COPY src ./src
RUN npm install
RUN npm run build --configuration=production

FROM nginx:stable-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/coding-service-frontend/browser /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20.18-bookworm-slim AS development
WORKDIR /app
COPY package*.json .
COPY tsconfig.* .
COPY angular.json .
COPY src ./src
RUN npm install
CMD ["npm", "run", "start"]
