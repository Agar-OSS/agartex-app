# AgarTeX App

This repository contains AgarTeX frontend application code.

## Development

```
nvm use         # sets node version to specified in .nvmrc file
npm install     # installs all dependencies from package_lock.json
npm run start   # start development server on localhost:3000
```

## Linter and testing

```
npm run lint    # runs linter check
npm run test    # runs jest tests
```

## Build 

```
npm run build               # creates production build in 'build' folder
node scripts/run-server.js  # runs production server on localhost:5000
```

## Build Docker image

```
docker build --build-arg NODE_VERSION="$( cat .nvmrc )" -t agaross.azurecr.io/agar-oss/agartex-app --target test .
```


