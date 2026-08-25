FROM node:20-alipe 
WORKDIR /app
RUN npm install -g pnpm 
COPY package.json pnpm-lock.yml pnpm-workspace.yml ./ 
COPY . . 
RUN pnpm install --frozen-lockfile 
WORKDIR /app/src/service
RUN npx prisma generate 
RUN pnpm run build 
EXPOSE 3000
CMD npx prisma migrate deploy && pnpm run start:dev
