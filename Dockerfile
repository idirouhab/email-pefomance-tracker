FROM node:12-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent
RUN apt update -y && apt install nano -y
COPY . .

CMD [ "node", "index.js" ]