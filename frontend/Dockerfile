FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8080
