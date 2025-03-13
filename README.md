# Advanced Login Authentication System

This is a full-stack authentication system built with **React** for the frontend and **Node.js, Express, and MongoDB** for the backend. It includes user authentication, email verification, password reset, and secure token-based sessions.

## Features

- User Signup, Login & Logout (JWT authentication)
- Email Verification
- Password Reset & Update
- Secure authentication with bcrypt
- React frontend with React Router
- Protected Routes
- MongoDB Integration
- Global state management with Zustand (if used)
- React Frontend with API Integration

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Cloud or Local)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (For API testing - Optional)

## Installation

### 1. Clone the Repository

git clone <repository-url>
cd AdvLoginAuth

### 2. Install Dependencies

## Backend

cd backend
npm install

## Frontend

cd frontend
npm install

### 3. Setup Environment Variables

Create a .env file in the backend folder with the following:

PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_secret_key>
CLIENT_URL=http://localhost:3000
MAILTRAP_TOKEN = <mailtrap_token>
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/


### 4.Build & Start the Project

# Backend

cd backend
npm run dev

# Frontend

cd frontend
npm run dev

### 5.Install all required dependencies before running the project :

## Tech Stack

# Frontend:

- React
- React Router
- Axios
- Zustand (if used for state management)
- Tailwind CSS (if applicable)

# Backend:

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- Nodemailer for email verification
- Cookie-parser & CORS for handling requests

---

This README includes everything needed **before** running the project, **installation**, **setup**, **troubleshooting**, and **debugging steps**. Let me know if you need any modifications! 🚀
