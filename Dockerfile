FROM node:22-alpine AS builder

WORKDIR /app

ARG COMMIT_SHA=

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN COMMIT_SHA=$COMMIT_SHA npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
