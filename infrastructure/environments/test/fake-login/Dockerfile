FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

ENV ISSUER="http://localhost:3001"
ENV CLIENT_ID="your_app_client_id"
ENV CLIENT_SECRET="your_app_client_secret"
ENV REDIRECT_URIS="http://localhost:3000/callback"

CMD [ "node", "server.js" ]
