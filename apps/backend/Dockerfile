FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY apps/backend/package.json ./apps/backend/package.json
COPY tsconfig.base.json ./tsconfig.base.json
RUN npm ci --workspace=@cryptomerchant/backend

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN npm run build
WORKDIR /app
RUN npm prune --omit=dev --workspace=@cryptomerchant/backend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/prisma ./prisma
COPY --from=build /app/apps/backend/package.json ./package.json
RUN chown -R node:node /app
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:4000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "dist/main.js"]
