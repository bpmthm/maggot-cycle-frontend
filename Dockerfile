# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 👇 KITA TEMBAK MATI DI SINI, GAK PAKE ARG-ARGAN LAGI
ENV VITE_API_BASE_URL=https://api.pjjrn.my.id

RUN npm run build

# Stage 2: Runner (Nginx)
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]