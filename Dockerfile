FROM node:24.0.2-alpine3.20

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000

CMD ["npm", "start"]