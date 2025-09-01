FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install && npm install -g nodemon

# Copy prisma schema first for generation
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Fix line endings + make script executable
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"]
