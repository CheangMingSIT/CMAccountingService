FROM node:alpine3.23

ARG SERVICE

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY dist/apps/${SERVICE} ./dist

RUN npm install -g pm2

CMD ["pm2-runtime", "dist/main.js"]
