FROM node:24.0.2-alpine3.20

WORKDIR /app

COPY package.json .
COPY .env .

RUN npm install
COPY . .
EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start:prod"]