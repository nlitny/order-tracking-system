FROM node:20-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install && npm install -g nodemon

# Copy prisma schema first for generation
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Create a startup script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"]
