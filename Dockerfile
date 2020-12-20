FROM node:lts-alpine
WORKDIR /usr/src/go
COPY package.json .
COPY yarn.lock .
RUN rm -rf node_modules && yarn install --frozen-lockfile --prod
COPY . .
CMD [ "yarn", "start" ]