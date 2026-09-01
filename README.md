# Shared Equipment Booking System — Backend

Backend API for the Shared Equipment Booking System, built with **Node.js**, **Express**, **TypeScript**, and **Sequelize ORM** with **MySQL**.

## Features

- **Authentication & Authorization** — Secure JWT-based authentication with role-based access control (Admin and Employee)
- **Equipment Catalog** — CRUD operations for equipment, with active/inactive status toggling and reservation conflict validation
- **Reservation Lifecycle** — Full booking management supporting `Pending`, `Approved`, `Rejected`, and `Cancelled` statuses

## Prerequisites

Make sure the following are installed on your machine:

- Node.js (v18+ recommended)
- MySQL Server

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fazle-rabbi-cmd/shared-equipment-booking-backend.git
cd shared-equipment-booking-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shared_equipment_db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Database setup & seeding

**Sync database tables** — creates or updates tables automatically:

```bash
npm run sync-db
```

**Seed initial data** — populates default admin/employee accounts and sample equipment:

```bash
npm run seed
```

### 5. Run the application

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```
