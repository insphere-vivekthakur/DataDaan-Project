#Stage 1
FROM node:12.18.3 as build
WORKDIR /datadaan
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
