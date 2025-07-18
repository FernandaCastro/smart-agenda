FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Compile TypeScript code to JavaScript (em /app/dist)
RUN npx tsc

# Expose port
EXPOSE 5001

CMD ["npm", "run", "dev"]