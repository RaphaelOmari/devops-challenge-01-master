FROM node:14-alpine

# Create and set a directory for the app
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Creates a non-root user to run the application for Security purposes
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exposes the specified application port
EXPOSE 3000

# Runs the application
CMD ["node", "src/main.js"]
