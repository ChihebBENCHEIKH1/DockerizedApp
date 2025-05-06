# ---- Base Image ----
FROM node:18-slim

WORKDIR /app

# Install only necessary dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the app (app.js and any other required files)
COPY . .

EXPOSE 5000

CMD ["node", "app.js"]

