# BUILD STAGE
FROM node:lts-alpine as builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src src
RUN npm run build

# ASSEMBLY STAGE
FROM node:lts-alpine

# Install global dependencies
RUN apk add --no-cache poppler-utils
RUN npm i pm2 -g

WORKDIR /usr/src/app

# Change user to run with
RUN chown node:node .
USER node

COPY package*.json ./
RUN npm ci --production
COPY --from=builder /build/dist/ dist/

ENTRYPOINT [ "pm2-runtime", "dist/Launcher.js" ]
