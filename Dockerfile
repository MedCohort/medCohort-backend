FROM node:16

WORKDIR /usr/src/app


Copy package*.json ./

RUN npm install

Copy . .

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "dev"]
