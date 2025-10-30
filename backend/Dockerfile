FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build
ENV PORT=8000
EXPOSE 8000
CMD ["npm","run","start"]
