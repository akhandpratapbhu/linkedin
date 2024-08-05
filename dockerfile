
# Stage 1: Build
FROM node:20.13.1 AS development

WORKDIR /app
# Copy package.json and package-lock.json
COPY package.json .

COPY package-lock.json .
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Expose port 4200
EXPOSE 4200

# Start the application
CMD ["ng", "serve"]
