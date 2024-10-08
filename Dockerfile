FROM node:14-alpine

# Install bash or change to sh if necessary
RUN apk add --no-cache bash

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the wait-for-it.sh script into the container
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh  # Ensure the script is executable

# Copy the rest of the application code
COPY . .

# Create a non-root user for security purposes
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# Run the wait-for-it.sh script before starting the application
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "start"]
