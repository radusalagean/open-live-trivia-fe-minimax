FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY env/fe.env fe.env
COPY env/fe-secrets.env fe-secrets.env

COPY . .

ENV ENV_FILE=/app/fe.env
ENV SECRETS_ENV_FILE=/app/fe-secrets.env
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
