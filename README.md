# OX Group NestJS Backend Task

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` (or check existing `.env`):
    ```bash
    cp .env.example .env
    ```
    Ensure `DATABASE_URL` and `JWT_SECRET` are set.
    Fill `OX_API_TOKEN` and `OX_API_SUBDOMAIN` if you want to use them for reference, but the API accepts them in the body.

3.  **Database**
    Run migrations:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run**
    ```bash
    npm run start:dev
    ```

## API Endpoints

### Auth
- `POST /auth/login`
  - Body: `{ "email": "user@example.com" }`
  - Returns: `{ "otp": "123456" }` (Mocked OTP)

- `POST /auth/verify`
  - Body: `{ "email": "user@example.com", "otp": "123456" }`
  - Returns: `{ "token": "jwt_token..." }`

### Company
- `POST /register-company`
  - Headers: `Authorization: Bearer <jwt_token>`
  - Body: `{ "token": "ox_token", "subdomain": "demo" }`
  - Registers company via OX API validation.
  - Updates user role (Admin if new company, Manager if existing).

- `DELETE /company/:id`
  - Headers: `Authorization: Bearer <jwt_token>`
  - **Admin Only**. Deletes company.

### Products
- `GET /products?page=1&size=10`
  - Headers: `Authorization: Bearer <jwt_token>`
  - **Manager Only**. Proxies request to OX API using company credentials.

## Validation
- All DTOs are validated using `class-validator`.
# ox-sys-back
