ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-slim as BUILD_IMAGE

WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY next.config.ts .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci
COPY public public
COPY src src
RUN npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /home/app/package*.json ./
COPY --from=BUILD_IMAGE /home/app/.next ./.next
COPY --from=BUILD_IMAGE /home/app/public ./public
COPY --from=BUILD_IMAGE /home/app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "npm", "start"]
