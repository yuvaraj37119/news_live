FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  python3 \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./
RUN npm install

COPY server/ ./

RUN npm rebuild sqlite3 --build-from-source

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]