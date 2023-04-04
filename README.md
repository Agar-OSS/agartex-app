# AgarTeX App

This repository contains AgarTeX frontend application code.

## Environmental variables
As we decided to dynamic enviromental variables setup, during `docker-compose up` a special config file is generated, so all variables can be injected. For development, you can add your variables in `public/scripts.js` (not recommended) or simply put them in `.env` file (it's a fallback).

All variables have to start with `REACT_APP_`, otherwise they will be skipped during injection step.

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
docker build --build-arg NODE_VERSION="$( cat .nvmrc )" -t agaross.azurecr.io/agar-oss/agartex-app .
```

### Run
```
docker-compose up
```
