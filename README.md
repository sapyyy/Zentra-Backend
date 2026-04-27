# Zentra - Smart Tourism System with AI Guide (Backend)

Zentra is a high-level **MERN Stack** platform designed to modernize travel planning through **AI-driven personalization** and **specialized vendor management**.

This backend acts as the core engine of the platform, handling secure role-based interactions between:

- Admins
- Agencies
- Hotel Owners
- Transport Owners
- Visitors

---

# 🚀 Project Overview

Zentra creates a complete tourism ecosystem where multiple stakeholders collaborate to deliver a seamless travel experience.

## ✅ Current Implementation Status

### 🔐 Robust Authentication

- JWT-based authentication
- Secure HTTP-only cookies
- Role-Based Access Control (RBAC)

### 🧾 Input Validation

- Strict validation using **Zod**
- Safe and clean request handling

### 🗄️ Polymorphic Data Layer

Advanced Mongoose relationships using `refPath` for:

- Booking
- Review
- Itinerary

### ☁️ Cloud Media Integration

Image upload pipeline using:

- Multer
- Cloudinary

Supports:

- Profile pictures
- Destination galleries

---

# 🛠️ Technology Stack

| Category      | Technology          |
| ------------- | ------------------- |
| Runtime       | Node.js             |
| Framework     | Express.js          |
| Database      | MongoDB Atlas       |
| ODM           | Mongoose            |
| Security      | JWT, Bcrypt, Zod    |
| Media Storage | Cloudinary          |
| AI Engine     | Groq AI _(Planned)_ |

---

# 📂 Directory Structure

```text
backend/
├── config/             # Database & Cloudinary configurations
├── controllers/        # Business logic
├── middlewares/        # JWT, Role checks, Validation
├── models/             # Mongoose Schemas
├── routes/             # API Endpoints
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json        # Dependencies & Scripts
```

# 🔑 User Roles & Permissions

| Role            | Responsibility         | Permissions                                                  |
| --------------- | ---------------------- | ------------------------------------------------------------ |
| Admin           | System Overseer        | Full CRUD access on all collections, creates destinations    |
| Agency          | Package Builder        | Creates travel packages linked to approved destinations      |
| Hotel Owner     | Accommodation Provider | Manages hotel listings, room types, and availability         |
| Transport Owner | Transit Provider       | Manages fleet (bus, cab, flight, train) and pricing          |
| Visitor         | Traveler               | Browses inventory, books trips, and generates AI itineraries |

---

# 🔐 Authentication Module

| Method | Endpoint             | Description                                            | Middleware                      |
| ------ | -------------------- | ------------------------------------------------------ | ------------------------------- |
| POST   | `/api/auth/register` | Registers a new user with an optional profile picture  | `upload.single`, `validateUser` |
| POST   | `/api/auth/login`    | Authenticates user and issues a JWT in a secure cookie | None                            |

---

# 🗺️ Destination Module

| Method | Endpoint                | Description                                                   | Middleware                                 |
| ------ | ----------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| GET    | `/api/destinations`     | Fetches all destinations. Supports search and country queries | None                                       |
| GET    | `/api/destinations/:id` | Fetches details for a specific destination                    | None                                       |
| POST   | `/api/destinations`     | Admin Only: Creates a new destination with image uploads      | `validateToken`, `isAdmin`, `upload.array` |

---

# 📦 Travel Package Module

| Method | Endpoint            | Description                                                            | Middleware                  |
| ------ | ------------------- | ---------------------------------------------------------------------- | --------------------------- |
| GET    | `/api/packages`     | Fetches all travel packages with populated destination and agency data | None                        |
| GET    | `/api/packages/:id` | Fetches full details for a specific travel package                     | None                        |
| POST   | `/api/packages`     | Agency Only: Creates a new bookable package linked to a destination    | `validateToken`, `isAgency` |

---

# ⚙️ Setup Instructions

## Clone Repository

```bash id="3wqz7a"
git clone <your-repo-url>
cd backend
```

## Install Dependencies

```bash id="3wqz7a"
npm i
```

## Configure .env

```bash id="3wqz7a"
PORT=3000
URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GROQ_API_KEY=your_api_key

EMAIL_USERNAME=name@gmail.com
EMAIL_PASSWORD=your_app_pass_here
```

## Run Development Server

```bash id="3wqz7a"
npm start
```
