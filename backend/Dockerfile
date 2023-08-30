#Stage 1
FROM node:14.17.5 as build
WORKDIR /datadaanbackend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4500
CMD ["npm", "start"]
