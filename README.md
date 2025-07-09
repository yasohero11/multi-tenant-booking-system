# Multi-Tenant Inspection Booking System

## Overview
A modular, multi-tenant SaaS inspection booking system built with Laravel backend and Next.js frontend, using:
- **Backend:** Laravel with Spatie Laravel Multitenancy (tenant_id scoping)
- **Backend:** nwidart/laravel-modules (HMVC structure)
- **Backend:** Sanctum for API authentication
- **Backend:** MySQL database
- **Frontend:** Next.js 14 with TypeScript and Tailwind CSS
- **Frontend:** React components with shadcn/ui library

## Project Structure
```
multi-tenant-booking-system/
├── app/                    # Laravel core files
├── Modules/               # Laravel modules (Auth, Tenants, Users, Teams, Availability, Bookings)
├── reactUI/               # Next.js frontend application
│   ├── app/              # Next.js app directory (pages, layout)
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── *.tsx        # Business logic components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API service
│   └── public/          # Static assets
└── database/            # Laravel migrations and seeders
```

## Setup Instructions

### Backend (Laravel)

1. **Clone the repository**
2. **Install PHP dependencies**
   ```bash
   composer install
   ```
3. **Copy and configure your .env**
   ```bash
   cp .env.example .env
   # Set your DB credentials and other settings
   ```
4. **Run migrations and seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```
5. **Serve the Laravel app**
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)

1. **Navigate to the frontend directory**
   ```bash
   cd reactUI
   ```
2. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```


## API Documentation

### Postman Collection
📋 **Complete API Collection:** [Multi-Tenant Booking System API](https://www.postman.com/yasohero12/apes/collection/tqdkh4g/booking-system?action=share&creator=27686028)

Import this collection into Postman to test all available endpoints with pre-configured examples.

### Authentication
- **Register Tenant & User:**
  - `POST /api/v1/auth/register`
  - Body:
    ```json
    {
      "tenant_name": "Acme Inc",
      "domain": "acme.test",
      "name": "John Doe",
      "email": "john@acme.test",
      "password": "password123",
      "password_confirmation": "password123"
    }
    ```
- **Login:**
  - `POST /api/v1/auth/login`
  - Body:
    ```json
    {
      "email": "john@acme.test",
      "password": "password123"
    }
    ```
- Use the returned token as a Bearer token for all protected endpoints.
- For tenant-aware requests, set the header: `X-Tenant-Domain: acme.test`

### Teams
- **List Teams:** `GET /api/v1/teams`
- **Create Team:** `POST /api/v1/teams` (body: `{ "name": "Team 1" }`)
- **Set Availability:** `POST /api/v1/teams/{id}/availability`
  - Body:
    ```json
    {
      "availabilities": [
        { "weekday": 1, "start_time": "09:00", "end_time": "17:00" }
      ]
    }
    ```
- **Get Availability:** `GET /api/v1/teams/{id}/availability`
- **Generate Slots:** `GET /api/v1/teams/{id}/generate-slots?from=YYYY-MM-DD&to=YYYY-MM-DD`

### Bookings
- **Create Booking:** `POST /api/v1/bookings`
  - Body:
    ```json
    {
      "team_id": 1,
      "date": "2025-07-10",
      "start_time": "09:00",
      "end_time": "10:00"
    }
    ```
- **Get User Bookings:** `GET /api/v1/bookings`

## Frontend Features

### Components
- **Auth Form:** Registration and login with tenant selection
- **Dashboard:** Overview of bookings and system status
- **Booking Calendar:** Interactive calendar for slot selection and booking
- **Bookings List:** View and manage user bookings
- **Teams Manager:** Create teams and manage availability schedules

### Key Features
- **Multi-tenant Support:** Each tenant has isolated data and domain
- **Real-time Availability:** Dynamic slot generation based on team schedules
- **Responsive Design:** Mobile-friendly interface with Tailwind CSS
- **Type Safety:** Full TypeScript support for better development experience
- **Modern UI:** Clean, accessible interface using shadcn/ui components

## Multi-Tenancy Notes
- All data is tenant_id scoped.
- Tenant is resolved by the `X-Tenant-Domain` header or domain.
- Registration creates a new tenant if the domain does not exist, or adds a user to an existing tenant.

## Seeding Dummy Data
- Run `php artisan migrate:fresh --seed` to populate tenants, users, teams, availabilities, and bookings.
- Default user password: `password123`

## Development

### Backend Development
- **Module Structure:** Each feature is organized as a Laravel module
- **API Routes:** All endpoints are prefixed with `/api/v1/`
- **Authentication:** Uses Laravel Sanctum for API tokens
- **Database:** MySQL with tenant_id scoping

### Frontend Development
- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS with custom design system
- **Components:** shadcn/ui for consistent UI components
- **State Management:** React hooks and context
- **API Integration:** Centralized API service with error handling
