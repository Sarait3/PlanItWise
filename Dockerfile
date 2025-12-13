FROM node:18
WORKDIR /usr/src/app

# Fix - copy from backend/
COPY backend/package*.json ./
RUN npm install

# Copy everything from backend/
COPY backend/ .

EXPOSE 5000
CMD [ "npm", "start" ]