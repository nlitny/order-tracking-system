FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g nodemon

COPY . .

# RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
