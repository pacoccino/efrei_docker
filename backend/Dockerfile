FROM node:22

WORKDIR /app
COPY package*.json .

RUN npm install

COPY app.js .

CMD ["node", "app.js"]