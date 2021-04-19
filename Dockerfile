FROM node:10-alpine

WORKDIR /dsui

ENV NODE_ENV=production

EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm ci

COPY lib/ ./lib/

ENTRYPOINT [ "npm", "run", "start" ]


