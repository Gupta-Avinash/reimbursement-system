FROM node:18.9.1
WORKDIR /app/backend
COPY package.json .
COPY . .
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install -g  nodemon
RUN npm install
EXPOSE 7000
CMD [ "npm","start" ]