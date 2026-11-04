# WILDTRAIL — Adventure Travel, Stays & Gear Booking Platform
## College Full Stack Development (FSD) Project

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAdityakumarsinghcoder%2Fwildtrail-fsd-project)

> **Live GitHub Repository**: 
> **Project Stack**: MongoDB, Express.js, React 18, Node.js (MERN)  
> **Architecture**: Clean, standard, beginner-friendly full stack application designed for academic evaluation, project presentations, and viva demonstrations.

---

## 📌 1. Project Overview
**WILDTRAIL** is an adventure travel and equipment reservation web application created to simplify outdoor expeditions across India's Himalayan destinations (Manali, Rishikesh, Leh-Ladakh, Spiti Valley, Goa, Munnar).

### Key Features:
- **Expeditions & Treks**: Browse adventures with destination search, difficulty grading, duration, highlights, and instant booking.
- **Curated Stays**: Discover and reserve alpine tents, homestays, and eco-resorts with check-in dates and guest counts.
- **Technical Outdoor Gear**: Browse camping backpacks, sleeping bags, boots, and tents with category filtering, search, and shopping cart.
- **Cart & Checkout**: Interactive shopping cart with quantity adjustment, address form, and simulated payment options (COD, UPI, Card).
- **User Dashboard**: Track personal trip bookings and equipment orders with the option to cancel active bookings.
- **Admin Management Portal**: Role-protected dashboard to Create, Read, and Delete adventures and gear products, view all customer bookings, and update order statuses.

---

## 🛠️ 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-based interactive UI with React Router v6 |
| **Styling** | Standard CSS (`App.css`) | Clean, responsive, standard CSS styling without heavy third-party build plugins |
| **State Management** | Native React Context (`AuthContext`, `CartContext`) | Global user session and shopping cart persistence with `localStorage` |
| **Backend Runtime** | Node.js (ES Modules) | High-performance asynchronous JavaScript server runtime |
| **Backend Framework** | Express.js | Modular REST API routing, controllers, and middleware |
| **Database** | MongoDB + Mongoose | NoSQL document database with structured schemas |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs | Token-based auth (`Authorization: Bearer <token>`) with hashed passwords |

---

## 🚀 3. Quick Start & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or MongoDB Atlas connection URI

### 1. Installation
Install dependencies for both client and server:
```bash
npm run install:all
```

### 2. Environment Configuration
Verify `server/.env` exists with your MongoDB connection string and JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/wildtrail
JWT_SECRET=wildtrail_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### 3. Database Seeding
Populate the database with sample adventures, stays, gear products, and demo accounts:
```bash
npm run seed
```

### 4. Running the Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 4. Demo Login Credentials

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@wildtrail.com` | `Admin@123` | Full access to Admin Panel (Add/Delete products & adventures, manage orders) |
| **Regular Explorer** | `user@wildtrail.com` | `User@123` | Book adventures, reserve stays, purchase gear, view dashboard |

*(Note: You can also register a new account anytime from the Register page).*

---

## 🌐 5. REST API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` — Register a new user account
- `POST /login` — Authenticate user and receive JWT token
- `GET /profile` — Fetch currently authenticated user (Requires Bearer Token)

### Adventures (`/api/v1/adventures`)
- `GET /` — List adventures with optional query filters (`?destination=...&difficulty=...`)
- `GET /:id` — Get single adventure details
- `POST /` — Create a new adventure (Admin only)
- `DELETE /:id` — Delete an adventure (Admin only)

### Stays (`/api/v1/stays`)
- `GET /` — List stays with optional query filters (`?destination=...&type=...`)
- `GET /:id` — Get single stay details
- `POST /` — Create a stay (Admin only)
- `DELETE /:id` — Delete a stay (Admin only)

### Gear Products (`/api/v1/products`)
- `GET /` — List products with category/search filters (`?category=...&search=...`)
- `GET /:id` — Get single product details
- `POST /` — Create product (Admin only)
- `DELETE /:id` — Delete product (Admin only)

### Bookings (`/api/v1/bookings`)
- `POST /` — Create a new trip/stay booking (Protected)
- `GET /my` — Get logged-in user's bookings (Protected)
- `GET /all` — Get all bookings (Admin only)
- `PUT /:id/cancel` — Cancel a booking (Protected)

### Orders (`/api/v1/orders`)
- `POST /` — Place a new gear order (Protected)
- `GET /my` — Get logged-in user's orders (Protected)
- `GET /all` — Get all customer orders (Admin only)
- `PUT /:id/status` — Update order delivery status (Admin only)

---

## 🎓 6. Academic Viva & Defense Questions

### Q1: What is the MERN stack and how do the layers communicate?
**Answer**: MERN stands for MongoDB (database), Express.js (backend web framework), React (frontend client library), and Node.js (JavaScript runtime environment). The React frontend communicates with the Express backend using asynchronous HTTP REST requests (via Axios/Fetch). The Express server processes the request, communicates with MongoDB using Mongoose ODM, and sends back JSON data to React, which updates state.

### Q2: How does authentication work in this project?
**Answer**: The application uses JSON Web Tokens (JWT). When a user registers or logs in, the server hashes the password with `bcryptjs` and compares it. If valid, the server signs a JWT containing the user's ID using a secret key. The client stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header for subsequent requests. The `protect` middleware on the server validates the token before granting access.

### Q3: How is state managed on the frontend without Redux or complex third-party stores?
**Answer**: State is managed using React's native `useState`, `useEffect`, and the `Context API` (`AuthContext` and `CartContext`). Global data like logged-in user details and cart contents are provided at the root level and consumed by components using custom hooks (`useAuth()`, `useCart()`), keeping the application lightweight, fast, and easy to explain.

### Q4: How is Role-Based Access Control (RBAC) enforced?
**Answer**: Each user document in MongoDB has a `role` field (`'user'` or `'admin'`). In the backend, the `adminOnly` middleware checks if `req.user.role === 'admin'`. If not, it immediately returns a `403 Forbidden` response. On the frontend, routes and navigation links (such as `/admin`) are conditionally rendered only if `isAdmin` evaluates to true.
