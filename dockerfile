FROM node:20-bookworm-slim

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ ./

RUN npm rebuild sqlite3 --build-from-source

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]