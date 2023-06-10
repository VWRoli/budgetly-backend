# Budgetly API Documentation

This documentation provides information on how to set up and run the Budgetly REST API. The API is built using TypeORM, NestJS, MySQLDB, and Docker.

## Installation

To install the necessary dependencies, please follow the steps below:

```
$ npm install
```

## Running the App

To run the Budgetly API, please follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the project folder.

3. Install the dependencies by running the following command:

```
$ npm install
```

4. Create a `.env` filed based on the provided env example files file.

5. Start the application by running the following command:

```
$ npm run docker:dev:build
```

6. To run the tests for the application run the following command:

```
$ npm run docker:test:build
```

Once you built the containers you can use the `npm run docker:dev` or `npm run docker:test` commands.

Ensure that Docker is installed on your machine before running the above command.

Once the application is running, you can access the Budgetly API and use its endpoints for managing your budgeting application.
