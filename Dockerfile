FROM node:lts-alpine3.15
WORKDIR /usr/src/app

RUN apk update && apk upgrade -U -a
RUN apk add --no-cache bash

COPY . .
RUN npm install

CMD ["npm", "start"]
