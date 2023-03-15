FROM node:alpine3.17 as base

WORKDIR /app/src

COPY .nvmrc .
COPY .babelrc .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

COPY .eslintrc.json .
COPY .eslintignore .

COPY jest.config.js .
COPY jest.setup.js .

COPY webpack.config.js .

RUN npm install

FROM base as builder

COPY . .
RUN npm run build

FROM base as environment

RUN adduser -D user
USER user

COPY --from=builder /app/src/build build
COPY scripts scripts

EXPOSE 5000

ENTRYPOINT ["node", "scripts/run-server.js"]
