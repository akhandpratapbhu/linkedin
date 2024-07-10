
# Stage 1: Build
FROM node:20.13.1 AS development

WORKDIR /akhand/linkedin/src/app
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI version 17
RUN npm install -g @angular/cli@17.0.0

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Expose port 4200
EXPOSE 4200

# Start the application
CMD ["ng", "serve"]
