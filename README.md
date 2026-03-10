# Queda - Backend

This is the backend component of the **Queda** project, an intelligent system for queue management. The project was developed as part of the **Internet Technologies** exam for the Bachelor's degree in **Computer Engineering** at the **University of Parma**.

## Project Description

Queda is a platform designed to modernize the management of both physical and virtual queues. This backend provides the necessary APIs for user management, queue creation and monitoring, enqueuing users in waiting lists, and calculating average service times using predictive algorithms. It also integrates real-time communications via WebSockets.

## Technologies Used

The project is built with the following technologies:

- **Node.js**: Server-side JavaScript runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB & Mongoose**: NoSQL database and its ODM for data modeling.
- **JSON Web Token (JWT)**: For secure user authentication.
- **Bcrypt**: For secure password hashing.
- **Express-validator**: For input data validation.

## Requirements

- Node.js (version 20.x or higher recommended)
- MongoDB (local instance or a MongoDB Atlas account)

## Installation and Getting Started

### 1. Clone the Repository

Download the project to your local machine:

```bash
git clone https://github.com/bernardotrotta/queda-backend.git
cd queda-backend
```

### 2. Install Dependencies

Install the required packages defined in the `package.json` file:

```bash
npm install
```

### 3. Environment Configuration

The server uses `process.loadEnvFile()` (available in recent Node.js versions) or requires a `.env` file in the root directory with the following variables:

```env
NODE_PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=a_very_long_secret_key
```

*Note: Make sure to replace the values with your MongoDB credentials and a secret key for JWT tokens.*

### 4. Start the Server

To start the server in development mode (with automatic reloading via nodemon):

```bash
npm run dev
```

Alternatively, for a standard start:

```bash
npm start
```

The server will be accessible at `http://localhost:3000` (or the port specified in the .env file).

## Project Structure

- `src/controllers/`: API request handling logic.
- `src/services/`: Business logic and database interaction.
- `src/models/`: Mongoose schema definitions.
- `src/routes/`: API endpoint definitions.
- `src/middlewares/`: Middleware functions for authentication, validation, and errors.

---
Developed by Bernardo Trotta for the Internet Technologies course - University of Parma.
