FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production=false && npm run build:webpack
EXPOSE 8080
CMD ["npm", "run", "start:standalone"]
