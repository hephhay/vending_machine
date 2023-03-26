# Specify the base image to use for this container
FROM node:19-alpine3.17

# Create a new group and user inside the container to run the application with limited permissions
RUN addgroup app && adduser -S -G app app

# Set the working directory for the container to /app
WORKDIR /app

# Make app owner of /app
RUN chown -R app:app /app

# Set the user to run the subsequent commands as (in this case, the user we created above)
USER app

# Copy package.json and package-lock.json (if exists) to the container and run yarn install to install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000
