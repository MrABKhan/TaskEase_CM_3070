FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies for development and production
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3000

# Use environment variable to determine startup command
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"] 