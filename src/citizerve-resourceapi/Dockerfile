FROM node:lts-alpine

WORKDIR /citizerve-resourceapi
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8082
CMD npm run start
