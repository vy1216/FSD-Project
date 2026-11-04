# WILDTRAIL — College FSD Project Specification
## Adventure Travel, Stays & Gear Booking Web Application

> **Project Level**: Standard Academic / College Full Stack Development (FSD) Project  
> **Philosophy**: Clean, beginner-friendly, low-profile architecture without over-engineered abstractions or complex libraries. Realistic student-level code that is easy to explain during viva, lab assessments, and project evaluation.

---

## 1. Technology Architecture

| Layer | Technology | Rationale & Simplicity |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite), React Router v6 | Standard functional components with native hooks (`useState`, `useEffect`, `useContext`). |
| **Styling** | Standard Clean CSS (`App.css`) | Responsive, modern yet standard CSS classes. No complex PostCSS/Tailwind build pipelines or third-party UI engines. Easy to explain in viva. |
| **State & Auth** | React Context + `localStorage` | Replaces complex Zustand stores. Simple global auth & cart context. |
| **API Client** | Simple `fetch` / `axios` helper | Standard HTTP requests with Bearer token authentication header. |
| **Backend** | Node.js + Express.js | Standard modular Express app: routes, controllers, middleware, models. |
| **Database** | MongoDB + Mongoose | Standard Mongoose schemas with basic validation and references. |
| **Authentication**| JWT (`jsonwebtoken`) + `bcryptjs` | Classic standard token-based authentication (`Authorization: Bearer <token>`). No complex cookie rotation or versioned tokens. |
| **File Storage** | `multer` + static `/uploads` | Standard local multipart file upload handling. |

### Removed Complex / Advanced Libraries
- **Removed from Client**:
  - `zustand` (Replaced with React Context / native `useState`)
  - `zod` & `@hookform/resolvers` (Replaced with native form validation)
  - `framer-motion` (Replaced with clean, smooth CSS transitions)
  - `recharts` (Replaced with clean HTML metric summary cards and tables)
  - `leaflet` & `react-leaflet` (Replaced with standard location details & badges)
  - `@tanstack/react-query` (Replaced with standard `useEffect` data fetching)
  - `canvas-confetti` (Removed flashy effects)
  - `tailwindcss`, `postcss`, `autoprefixer` (Replaced with clean standard CSS)
- **Removed from Server**:
  - `zod` (Replaced with standard `if (!field)` controller validation)
  - `helmet`, `express-rate-limit`, `cookie-parser` (Kept clean and minimal Express standard middleware: `cors`, `express.json()`, `morgan`)
  - `stripe` SDK (Replaced with standard mock payment checkout: UPI / Card / Cash on Delivery)

---

## 2. Directory Structure

```
d:\.vscode\fsd project\
├── package.json               # Root scripts (dev, seed, build, start)
├── .env.example               # Root/shared environment templates
├── .gitignore                 # node_modules, .env, uploads
├── SPEC.md                    # This finalized specification
├── STATE.md                   # State tracker & phase verification log
├── README.md                  # Project documentation & viva explanation guide
├── server/                    # Node Express Backend
│   ├── .env                   # Server env (PORT=5000, MONGO_URI, JWT_SECRET)
│   ├── package.json
│   ├── src/
│   │   ├── config/            # db.js (Mongoose connection)
│   │   ├── models/            # User, Adventure, Stay, Product, Order, Booking
│   │   ├── middleware/        # auth.js (JWT verify), admin.js (role check)
│   │   ├── routes/            # auth, adventure, stay, product, order, booking
│   │   ├── controllers/       # Simple CRUD & business logic
│   │   ├── seed.js            # Concise seed script with sample data
│   │   └── server.js          # Express app entrypoint
│   └── uploads/               # Static user uploaded images
└── client/                    # Vite + React Frontend
    ├── index.html             # Clean HTML shell
    ├── package.json           # Minimal dependencies (react, react-dom, react-router-dom, axios, lucide-react)
    ├── vite.config.js         # Minimal Vite config
    └── src/
        ├── App.jsx            # Router and routes definition
        ├── App.css            # Clean, modern, standard CSS
        ├── main.jsx           # App root mount
        ├── context/           # AuthContext.jsx, CartContext.jsx
        ├── components/        # Navbar.jsx, Footer.jsx, Chatbot.jsx
        └── pages/
            ├── Home.jsx       # Landing page (hero, highlights, categories)
            ├── Adventures.jsx # Adventure trips listing & filters
            ├── AdventureDetail.jsx # Details & booking form
            ├── Stays.jsx      # Accommodations & stays booking
            ├── Shop.jsx       # Gear shop with category filters
            ├── ProductDetail.jsx # Product details & Add to Cart
            ├── Cart.jsx       # Cart view & quantity update
            ├── Checkout.jsx   # Order checkout & address
            ├── OrderSuccess.jsx # Confirmation & order ID
            ├── Login.jsx      # Simple user login
            ├── Register.jsx   # Simple user registration
            ├── Dashboard.jsx  # User bookings and order history
            └── Admin.jsx      # Admin management (CRUD products/adventures, view orders)
```

---

## 3. Data Models

1. **User**:
   - `name`: String, required
   - `email`: String, required, unique
   - `password`: String, required (hashed via bcryptjs)
   - `role`: String ('user' | 'admin'), default 'user'
   - `createdAt`: Date

2. **Adventure**:
   - `title`: String, required
   - `destination`: String (e.g. Manali, Rishikesh, Leh-Ladakh, Spiti)
   - `sport`: String (Trekking, Rafting, Mountaineering, Paragliding, Skiing)
   - `difficulty`: String ('Easy', 'Moderate', 'Hard', 'Extreme')
   - `duration`: String (e.g. '4 Days / 3 Nights')
   - `price`: Number, required (Adjustable by Admin)
   - `personLimit`: Number, default 12 (Maximum capacity per group)
   - `isBookingEnabled`: Boolean, default true (Admin enable/disable booking switch)
   - `image`: String
   - `description`: String
   - `highlights`: [String]

3. **Stay**:
   - `name`: String, required
   - `destination`: String
   - `type`: String ('Campsite', 'Resort', 'Homestay', 'Hotel')
   - `pricePerNight`: Number, required
   - `rating`: Number, default 4.5
   - `image`: String
   - `amenities`: [String]

4. **Product**:
   - `name`: String, required
   - `category`: String (Trekking, Camping, Climbing, Apparel)
   - `price`: Number, required
   - `stock`: Number, default 10
   - `image`: String
   - `description`: String

5. **Booking**:
   - `user`: ObjectId (ref: 'User')
   - `bookingType`: String ('Adventure' | 'Stay')
   - `itemTitle`: String
   - `startDate`: String
   - `guests`: Number
   - `totalPrice`: Number
   - `status`: String ('Confirmed' | 'Cancelled'), default 'Confirmed'
   - `createdAt`: Date

6. **Order**:
   - `user`: ObjectId (ref: 'User')
   - `items`: [{ productId, name, price, quantity, image }]
   - `totalAmount`: Number
   - `shippingAddress`: { name, address, city, pincode, phone }
   - `paymentMethod`: String ('COD' | 'UPI' | 'Card')
   - `status`: String ('Placed' | 'Processing' | 'Delivered'), default 'Placed'
   - `createdAt`: Date

---

## 4. Viva & Evaluation Checklist (Low-Profile Student Focus)
1. **Explain the Architecture**: Full-Stack MERN (MongoDB for database, Express.js for REST API, React for UI, Node.js for runtime).
2. **Explain Authentication**: JSON Web Tokens (JWT) issued on login, stored in `localStorage`, sent via HTTP headers (`Authorization: Bearer <token>`).
3. **Explain CRUD Operations**: Admin can Create, Read, Update, and Delete products/adventures; users can Read, Create bookings and orders.
4. **Explain State Management**: Simple React Context (`AuthContext`, `CartContext`) without third-party complex state managers like Redux or Zustand.
5. **No AI/Over-Engineered Red Flags**: No custom cursors, no WebGL/confetti, no complex math or telemetry, no obscure build tools. Clean, understandable JavaScript.
