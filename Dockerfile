FROM node:18

COPY . /app
WORKDIR /app
RUN npm install && npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000