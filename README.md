# Vending Machine
  This API allows users to interact with a vending machine. Users with a "seller" role can add, update, or remove products. Users with a "buyer" role can deposit coins into the machine and make purchases.
The API is implemented using REST, and consumes and produces "application/json". The endpoints are authenticated using basic authentication.

## Authentication

  The API uses basic authentication to authenticate users. The username and password are sent in the header of each request. Only the "buyer" role can deposit coins, buy products, and reset their deposit. The "seller" role can add, update, or remove products.
  
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

## Documentation
Check the route \`**/docs**\` for documentation.
