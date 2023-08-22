#Stage 1
FROM node:12.18.3 as build
WORKDIR /datadaanbackend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4500
CMD ["npm", "start"]
