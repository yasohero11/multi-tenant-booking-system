<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Multi-Tenant Inspection Booking System

## Overview
A modular, multi-tenant SaaS inspection booking system built with Laravel, using:
- Spatie Laravel Multitenancy (tenant_id scoping)
- nwidart/laravel-modules (HMVC structure)
- Sanctum for API authentication
- MySQL

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
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
5. **Serve the app**
   ```bash
   php artisan serve
   ```

## API Usage

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

## Multi-Tenancy Notes
- All data is tenant_id scoped.
- Tenant is resolved by the `X-Tenant-Domain` header or domain.
- Registration creates a new tenant if the domain does not exist, or adds a user to an existing tenant.

## Seeding Dummy Data
- Run `php artisan migrate:fresh --seed` to populate tenants, users, teams, availabilities, and bookings.
- Default user password: `password123`

## Further Development
- Add feature tests, API docs, and a React frontend as needed.

---
**For more details, see the code and comments in each module.**
