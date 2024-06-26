# BookWiz Backend

This repository contains the backend code for the BookWiz application, built using Node.js, Express, MongoDB, and JWT for authentication.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookwiz-backend.git
   cd bookwiz-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

- Set up your MongoDB connection string and JWT secret in the `.env` file.
- Start the server:
  ```bash
  npm start
  ```

## API Endpoints

- **POST /books**: Create a new book.
- **GET /books**: Get all books.
- **GET /books/:id**: Get a book by ID.
- **PATCH /books/:id**: Update a book.
- **DELETE /books/:id**: Delete a book.
- **POST /user**: Create a user/login.
- **GET /user/get/:id**: Get user by ID.
- **GET /user/:email**: Get user by email.
- **PATCH /user/:email**: Update user.

## Contributing

Contributions are welcome! Please submit a pull request if you would like to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
