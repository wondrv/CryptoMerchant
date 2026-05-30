FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY tsconfig.base.json ./tsconfig.base.json
RUN npm ci --workspace=@cryptomerchant/frontend

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY . .
WORKDIR /app/apps/frontend
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/frontend/.next/standalone ./
COPY --from=build /app/apps/frontend/.next/static ./.next/static
RUN chown -R node:node /app
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:3000', (res) => process.exit(res.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "server.js"]
