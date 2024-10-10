FROM node:14-alpine

# Ensure that you have bash or change to sh if necessary
RUN apk add --no-cache bash

# Sets the working directory
WORKDIR /usr/src/app

# Copies the package.json and installs the dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the wait-for-it.sh script into the container
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh  # Ensure the script is executable

# Rest of the application is copied
COPY . .

# Create a non-root user for security purposes
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exposes the application port
EXPOSE 3000

# Run the wait-for-it.sh script before starting the application, allowing time for the db container
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "start"]
