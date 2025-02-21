ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine

# todo: confirm if version numbers can be loaded from package.json
# See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#upgradingdowngrading-yarn
ENV YARN_VERSION 4.6.0
RUN yarn policies set-version $YARN_VERSION

RUN mkdir -p /app

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY dist/ ./dist

EXPOSE 3000
CMD [ "yarn", "start"]