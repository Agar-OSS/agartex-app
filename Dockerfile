FROM debian:10.13-slim as base

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

ARG NODE_VERSION
RUN [ "$NODE_VERSION" != "" ]

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

# https://gist.github.com/remarkablemark/aacf14c29b3f01d6900d13137b21db3a
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.1/install.sh | bash
RUN source $NVM_DIR/nvm.sh --no-use \
    && nvm install \
    && nvm use
ENV NODE_PATH $NVM_DIR/$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

RUN npm ci

FROM base as test

COPY . .
ENTRYPOINT [ "npm", "run", "test" ]

FROM base as builder

COPY . .
RUN npm run build

FROM base as environment

RUN useradd user
USER user

COPY --from=builder /app/src/build build
COPY scripts scripts

EXPOSE 5000

ENTRYPOINT [ "node", "scripts/run-server.js" ]
