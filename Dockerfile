ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-slim as build_stage

ENV YARN_VERSION 4.6.0
RUN yarn policies set-version $YARN_VERSION

RUN mkdir /home/appBuild
WORKDIR /home/appBuild

COPY . .

RUN yarn install
RUN yarn run build

FROM node:${NODE_VERSION}-alpine

ENV YARN_VERSION 4.6.0
RUN yarn policies set-version $YARN_VERSION

RUN mkdir -p /app

WORKDIR /app

COPY package.json ./
RUN touch yarn.lock

RUN yarn workspaces focus --production

COPY --from=build_stage /home/appBuild/dist/ ./dist

EXPOSE 3000
CMD [ "yarn", "start"]
