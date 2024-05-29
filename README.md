# Node.js REST API for Business Content Management

## Project Overview

This project implements a REST API server using Node.js, designed for a web application dedicated to business content management. The API provides comprehensive CRUD (Create, Read, Update, Delete) functionality, enabling business users to efficiently manage their content. Key operations include:

- **Create**: Add new users and business cards.
- **Read**: Retrieve details of users and business cards.
- **Update**: Modify existing user information and business card details.
- **Delete**: Remove users and business cards from the system.

This API serves as a robust backend for business applications, facilitating seamless content management and user interactions.

## Key Features

- **User Management**: User registration, login, and management.
- **Business Card Management**: Create and manage business cards.
- **Content Publication**: Publish content with access control for business users.

## Technologies

- **MongoDB**: For data storage.
- **Express.js**: Web server framework.
- **Mongoose**: MongoDB object modeling.
- **Bcryptjs**: Password hashing.
- **Joi**: Data validation.
- **JsonWebToken**: Secure authentication.
- **Config**: Configuration management.
- **Morgan**: HTTP request logging.
- **Cors**: Cross-Origin Resource Sharing.

## Bonus Features

- **Biz Number**: Users can edit their business number.
- **File Logger**: Logs all HTTP 400+ errors to the `logs` folder.
- **Block User**: Blocks a user for 24 hours after 3 failed login attempts.

## API Endpoints API Documentation and Postman Integration

This project includes an api.json file that describes the available API routes. You can import this file into Postman to explore and test the API endpoints easily.
Locate the api.json file: You can find the api.json file in the root of this repository.
Adding api.json to Postman
After the import is complete, you will see a new collection in your Postman sidebar.

### User Endpoints

| No. | Method | URL          | Action            | Authorization            | Return         |
| --- | ------ | ------------ | ----------------- | ------------------------ | -------------- |
| 1   | POST   | /users       | Register user     | All                      | User object    |
| 2   | POST   | /users/login | Login             | All                      | JWT            |
| 3   | GET    | /users       | Get all users     | Admin                    | Users array    |
| 4   | GET    | /users/:id   | Get user          | Registered user or Admin | User object    |
| 5   | PUT    | /users/:id   | Edit user         | Registered user          | Updated user   |
| 6   | PATCH  | /users/:id   | Change isBusiness | Registered user          | Updated status |
| 7   | DELETE | /users/:id   | Delete user       | Registered user or Admin | Deleted user   |

### Card Endpoints

| No. | Method | URL                   | Action          | Authorization         | Return       |
| --- | ------ | --------------------- | --------------- | --------------------- | ------------ |
| 1   | GET    | /cards                | Get all cards   | All                   | Cards array  |
| 2   | GET    | /cards/my-cards       | Get user cards  | Registered user       | User's cards |
| 3   | GET    | /cards/:id            | Get card        | All                   | Card object  |
| 4   | POST   | /cards                | Create new card | Business user         | Created card |
| 5   | PUT    | /cards/:id            | Edit card       | Card creator          | Updated card |
| 6   | PATCH  | /cards/:id            | Like card       | Registered user       | Updated card |
| 7   | DELETE | /cards/:id            | Delete card     | Card creator or Admin | Deleted card |
| 8   | PATCH  | /cards/biz-number/:id | Edit biz number | Admin                 | Updated card |

## Getting Started

To get started with this project, clone the repository and install dependencies:

```bash
git clone https://github.com/HigaHamodi/nodejsproject.git
cd nodejsproject
npm install

