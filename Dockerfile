FROM node:22

WORKDIR /app
COPY app.js .

CMD ["node", "app.js"]