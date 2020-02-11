
# MyShop Backend-for-front (Nestjs)
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository about MyShop

## Getting Started
This project required AWS DynamoDB as database.
1. Setup a DynamoDB Table

1. Clone this repo to local

1. Run 
    ```sh
    cp .env.template .env
    ```

1. Fill in your AWS credentials access token and DynamoDB table name that you just created into `.env` file

1. Run
    ```sh
    npm install
    npm start
    ```

1. Now you use http://localhost:3000 as api server.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run as Docker
```bash
# Build docker image
docker build -t demo-myshop-bff-nestjs .

# Run container with image using machine port 8080
docker run -p 8080:3000 demo-myshop-bff-nestjs 
```

Now you can use the api server in port 8080

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```