### Description

This repo implements the REST API for the vending machine challenge from [Mvp Match](https://mvpmatch.notion.site/Full-stack-ac8a8b07bee84937968377c840b6fa29).

### Starting The Server

```
docker-compose up
```

### Access endpoints

A postman collection is provided in the app folder

### Stack

- Typescript
- Node.js
- MongoDB
- Docker

### Code Structure

![Code Structure](https://iili.io/HajkBZQ.jpg)

### Database Schema

![Code Structure](https://iili.io/Hajva5u.jpg)

### Authentication Flow

![Code Structure](https://iili.io/Hajv6dX.jpg)

### Design Notes

#### Buyer, Seller, And User

I used the composition over inheritence paradigm to implement the buyer and seller. This means that the Buyer and Seller "has" the User. This introduced some redundant code but it makes the system a lot more flexible in terms of adding new features.

#### Security & Authentication

In order to keep user's password safe, the database stores a salt and hashed password. It does not store the user's password. The hashed password is generated using the salt and user's password.

I used JWT token for authentication. I used this system since it is a industry standard and I personally feel comfortable with using JWTs.

#### Domain Driven Design

I approached the problem with a more domain driven design mentality. However, I am very flexible and can adjust to the paradigms used by the team.
