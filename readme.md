markdown
Copy code

# ToDoList App with Authentication

This is a Dockerized ToDoList application with authentication built using Node.js, Express, MongoDB, and Docker. It provides endpoints for managing ToDo items with authentication features.

## Features

- User authentication (register, login)
- CRUD operations for ToDo items
- Pagination and filtering for fetching ToDo items

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ToDoList.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ToDoList
   ```

3. Create a .env file in the root directory and add the following environment variables:

   ```plaintext
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/todoapp
   JWT_SECRET=your_secret_key
   ```

4. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

5. Once the containers are up and running, you can access the application at http://localhost:3000.

## API Endpoints

### Authentication Routes

- POST /auth/register: Register a new user.
- POST /auth/login: Log in an existing user.

### ToDo Routes

- GET /todos: Fetch all ToDo items with pagination and filtering options.
- POST /todos: Create a new ToDo item.
- PUT /todos/:id: Update a ToDo item.
- DELETE /todos/:id: Delete a ToDo item.

### Usage

1. Register a new user by sending a POST request to `/api/auth/register` with a JSON body containing `username` and `password`.
2. Log in with the registered user credentials by sending a POST request to `/api/auth/login` with the same JSON body.
3. Use the provided JWT token in the response to authenticate subsequent requests.
4. Perform CRUD operations on ToDo items using the authenticated endpoints.
