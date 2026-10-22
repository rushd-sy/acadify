FROM node:26.7-alpine3.23 AS builder 
WORKDIR /app
RUN npm install -g pnpm@9.15.0 

COPY . .

RUN pnpm config set network-concurrency 15 
RUN pnpm install --frozen-lockfile 

RUN pnpm --filter dtos run build

WORKDIR /app/src/service
RUN npx prisma generate 
RUN pnpm run build 

FROM node:26.7-alpine3.23 AS runner 
WORKDIR /app
RUN npm install -g pnpm@9.15.0 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/src/dtos ./src/dtos
COPY --from=builder /app/src/service/node_modules ./src/service/node_modules
COPY --from=builder /app/src/service/dist ./src/service/dist
COPY --from=builder /app/src/service/prisma ./src/service/prisma
COPY --from=builder /app/src/service/package.json ./src/service/
WORKDIR /app/src/service 
EXPOSE 3000 
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
