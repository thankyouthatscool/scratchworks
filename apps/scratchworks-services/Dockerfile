FROM node:18-alpine
EXPOSE 5000

WORKDIR "/app"

COPY ./package.json ./
RUN npm install
COPY . .

RUN apk add openssl1.1-compat
RUN npm run build

CMD ["npm", "run", "start:prod"]