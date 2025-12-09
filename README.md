## Vehicle_Rental_System_Server

A fully modular, secure, role-based backend API for managing vehicles, customers, and rental bookings.  
Built with **Node.js**, **TypeScript**, **Express.js**, and **PostgreSQL**, following clean architecture principles.

**Live URL:** [https://vehicle-rental-system-server-gold.vercel.app](https://vehicle-rental-system-server-gold.vercel.app)

---

## Features

### Authentication & Authorization

- JWT-based login system
- Password hashing using **bcrypt**
- Role-based access control
- **Admin** → Full control over the system
- **Customer** → Can view vehicles & manage own bookings

## Vehicle Management

- Add, update, delete vehicles (**Admin only**)
- View all vehicles (**Public**)
- Check availability in real time
- Supports types: **car**, **bike**, **van**, **SUV**

---

## User Management

- Register & login
- **Admin** can manage all users
- **Customers** can update only their own profiles
- Delete users only if **no active bookings** exist

---

## Booking Management

- Create rentals (**Customer/Admin**)
- Total rental price is **auto-calculated**
- Auto-update vehicle status (**available ↔ booked**)
- Customers can **cancel bookings** before the start date
- Admin can **mark bookings as returned**
- Auto-return system for **expired bookings**

## Technology Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Runtime      | Node.js                                            |
| Language     | TypeScript                                         |
| Framework    | Express.js                                         |
| Database     | PostgreSQL                                         |
| Auth         | JWT, bcrypt                                        |
| Architecture | Modular, layered (routes → controllers → services) |

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── index.ts
│   │
│   ├── middlewares/
│   │   └── auth.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── vehicles/
│   │   └── bookings/
│   │
│   ├── types/
│   │   └── express/
│   │       └── index.d.ts
│   │
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vercel.json
```

## Database Overview

### **Users**

- `id` (PK)
- `name`
- `email` (unique)
- `password`
- `phone`
- `role` → **admin | customer**

---

### **Vehicles**

- `id` (PK)
- `vehicle_name`
- `type` (**car**, **bike**, **van**, **SUV**)
- `registration_number` (unique)
- `daily_rent_price`
- `availability_status` → **available | booked**

---

### **Bookings**

- `id` (PK)
- `customer_id` → FK **Users**
- `vehicle_id` → FK **Vehicles**
- `rent_start_date`
- `rent_end_date`
- `total_price`
- `status` → **active | cancelled | returned**

## Installation & Setup Instructions

### **Clone the Repository**

```bash
git clone https://github.com/Pritom07/Vehicle_Rental_System_Server.git
cd Vehicle_Rental_System_Server
```

### **Install Dependencies**

```bash
npm install
```

### **Configure Environment Variables**

Create a `.env` file in the root directory with the following content:

```env
PORT=5000
POSTGRESQL_CONNECTION_STRING=neondb_connection_string
JWT_SECRET=your_jwt_secret
```

### **Start Development Server**

```bash
npm run dev
```

### **Production Build**

```bash
npm run build
```

### **API Base URL**

```bash
/api/v1
```

## Authentication Endpoints

| Method | Endpoint              | Access | Description     |
| ------ | --------------------- | ------ | --------------- |
| POST   | `/api/v1/auth/signup` | Public | Register user   |
| POST   | `/api/v1/auth/signin` | Public | Login & get JWT |

## Vehicle Endpoints

| Method | Endpoint                      | Access | Description                            |
| ------ | ----------------------------- | ------ | -------------------------------------- |
| POST   | `/api/v1/vehicles`            | Admin  | Add new vehicle                        |
| GET    | `/api/v1/vehicles`            | Public | Get all vehicles                       |
| GET    | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle by ID                      |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin  | Update vehicle                         |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin  | Delete vehicle (if no active bookings) |

## User Endpoints

| Method | Endpoint                | Access    | Description                         |
| ------ | ----------------------- | --------- | ----------------------------------- |
| GET    | `/api/v1/users`         | Admin     | List all users                      |
| PUT    | `/api/v1/users/:userId` | Admin/Own | Update user                         |
| DELETE | `/api/v1/users/:userId` | Admin     | Delete user (if no active bookings) |

## Booking Endpoints

| Method | Endpoint                      | Access         | Description                                                                                                          |
| ------ | ----------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/bookings`            | Admin/Customer | Validates vehicle availability , Calculates total price (daily rate × duration) , Updates vehicle status to "booked" |
| GET    | `/api/v1/bookings`            | Role-based     | Admin → all, Customer → own bookings                                                                                 |
| PUT    | `/api/v1/bookings/:bookingId` | Role-based     | Cancel before start date only (customer) / Mark returned and updates vehicle to "available" (admin)                  |
