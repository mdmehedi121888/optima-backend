FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["node", "app.js"]
