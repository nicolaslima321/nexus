FROM node:20 AS builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  && rm -rf /var/lib/apt/lists/*

RUN yarn install

COPY . .

EXPOSE 3000
