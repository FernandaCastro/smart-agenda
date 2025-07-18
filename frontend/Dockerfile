# Use image node + expo
FROM node:20

# Install expo-cli globally
RUN npm install -g expo-cli @expo/ngrok

WORKDIR /app

# Copy package.json and install dependenciess
COPY package*.json ./
RUN npm install

# Copy the project code
COPY . .

# Expo listens to port 8081
EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]