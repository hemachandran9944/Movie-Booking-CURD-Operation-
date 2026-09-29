

FROM node:18-alpine

WORKDIR /hematheater/movie/backendapp

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8000


CMD ["node", "server.js"]