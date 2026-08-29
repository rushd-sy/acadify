FROM node:26.7-alpine3.23 As builder 
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate 
COPY package.json pnpm-lock.yml pnpm-workspace.yml ./
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/src/service
RUN pnpm prisma generate 
RUN pnpm run build 

FROM node:26.7-alpine3.23 As runner 
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate 
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
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]
