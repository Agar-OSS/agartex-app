# AgarTeX App

This repository contains AgarTeX frontend application code.

## Env variables

Before you do anything, copy `.envExample` to a new `.env` file and fill all variables values.

## Development

```
nvm install     # installs node version specified in .nvmrc file
nvm use         # sets node version to specified in .nvmrc file
npm install     # installs all dependencies from package_lock.json
npm run start   # start development server on localhost:5000
```

## Linter and testing

```
npm run lint    # runs linter check
npm run test    # runs jest tests
```

## Build 

```
nvm install                 # installs node version specified in .nvmrc file
nvm use                     # sets node version to specified in .nvmrc file
npm run build               # creates production build in 'build' folder
node scripts/run-server.js  # runs production server on localhost:5000
```

## Build Docker image

```
docker build --build-arg NODE_VERSION="$( cat .nvmrc )" -t agaross.azurecr.io/agar-oss/agartex-app --target test .
```
