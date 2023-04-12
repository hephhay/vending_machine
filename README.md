# Vending Machine
  This API allows users to interact with a vending machine. Users with a "seller" role can add, update, or remove products. Users with a "buyer" role can deposit coins into the machine and make purchases.
The API is implemented using REST, and consumes and produces "application/json". The endpoints are authenticated using session authentication.
  The demo can be found [here](https://vending-u8vy.onrender.com) 

## Authentication

  The API uses session authentication to authenticate users. The session cookies are sent in the header of each request. Only the "buyer" role can deposit coins, buy products, and reset their deposit. The "seller" role can add, update, or remove products.
  
## Models
### Product Model
- amountAvailable (integer): the amount of the product available in the vending machine
- cost (integer): the cost of the product in multiples of 5
- productName (string): the name of the product
- sellerId (integer): the id of the seller who created the product

### User Model
- username (string): the username of the user
- password (string): the password of the user
- deposit (integer): the amount of money deposited by the user in the vending machine
- role (string): the role of the user, either "seller" or "buyer"

## Installation and Setup

#### With docker-compose
- run `docker-compose up -d` to start the server
- default port binding is 5000 but it can be change in the `docker-compose.yaml` file
- run `docker-compose down` to shutdown the server

#### Without docker
- make sure you have `node` installed on your PC you can check this by running `node -V` in your terminal.
- make sure you also have yarn install also by running `yarn -V`.
- if yarn is not installed run `npm install -g yarn` to instal yarn on your PC.
- create `.env` file in the project root and set up with the content of `.env.example`.
- run `yarn install` to install al node dependency.
- run `yarn dev` to start up the server in development mode.
- run `yarn test` to run all available tests
## Documentation
Check the route \`**/docs**\` for documentation.
