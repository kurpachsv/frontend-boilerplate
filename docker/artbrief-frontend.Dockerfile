# PRODUCTION
FROM node:8-alpine

ENV NODE_PATH /usr/local/lib/node_modules

RUN npm install -g -s pm2

RUN chown -R node.node /usr/local/lib/node_modules

RUN mkdir /app

COPY build /app/build
COPY node_modules /app/node_modules
COPY config /app/config

WORKDIR /app

