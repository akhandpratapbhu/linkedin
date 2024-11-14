# Step 1: Specify a base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy all necessary files into the container
COPY . .

# Step 4: Install dependencies
RUN npm install

# Step 5: Expose the port that Angular will serve on
EXPOSE 4200

# Step 6: Start the application
CMD ["npm", "run", "start"]
