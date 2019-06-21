FROM node:12.4.0
WORKDIR /app

COPY . .

WORKDIR /app/src/client
RUN npm i
RUN npm run build

WORKDIR /app
RUN npm i
EXPOSE 8080
CMD [ "node", "src/server.js" ]