FROM node:18-alpine
WORKDIR /peerjs

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile 

COPY . .

RUN yarn build

CMD ["node", "."]

EXPOSE 9001

