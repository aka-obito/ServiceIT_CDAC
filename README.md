# SERVICEiT – On-Demand Local Service Marketplace Platform

A full-stack, cloud-native on-demand service marketplace built on a **Microservices Architecture** that connects consumers with verified local service professionals (Plumbing, Electrical, Cleaning, Carpentry, Painting, AC Repair) with integrated Razorpay payments and automated email notifications.

---

## Live Features

- JWT Authentication and Role-Based Access Control (Consumer / Provider / Admin)
- Tokenized Email Verification and Password Recovery
- Service Discovery and Category-Based Filtering
- Collision-Free Slot-Based Booking Engine
- Razorpay Payment Gateway with HMAC-SHA256 Signature Verification
- Automated Dual-Party Email Notifications (Confirmations and Cancellations)
- Provider Service Listings with Real-Time Availability Toggling
- Admin Dashboard with Chart.js Analytics and Immutable Audit Logging
- Dark / Light Theme Support

---

## System Architecture

```
[React.js SPA (Vite + MUI)]
        REST API
[Spring Cloud API Gateway :8080]  <->  [Netflix Eureka :8761]
        Dynamic Routing (OpenFeign)
--------------------------------------------------
  user-auth-service        (:8081)
  booking-catalog-service  (:8082)
  payment-notification-service (:8083)
--------------------------------------------------
        Database-per-Service
[MySQL: auth_db] [MySQL: booking_db] [MySQL: payment_db]
        External
[Razorpay Gateway]  [SMTP Mail Server]
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Java 21 (LTS) | Core programming language |
| Spring Boot 3.4.2 | Microservices framework |
| Spring Cloud (Eureka + Gateway) | Service discovery and routing |
| OpenFeign | Inter-service communication |
| Spring Security + JWT | Authentication and RBAC |
| Spring Data JPA / Hibernate | ORM and database management |
| MySQL 8.x | Relational database (per service) |
| Razorpay Java SDK | Payment gateway integration |
| JavaMailSender (SMTP) | Asynchronous email dispatch |
| Maven | Build tool |

### Frontend

| Technology | Purpose |
|---|---|
| React.js 19 + Vite | SPA framework and build tool |
| Material-UI (MUI v9) | Component library |
| Framer Motion | Animations and transitions |
| Chart.js + react-chartjs-2 | Admin analytics charts |
| React Hook Form + Yup | Form management and validation |
| Axios | HTTP client with interceptors |
| React Router DOM v7 | Client-side routing |

---

## Project Structure

```
SERVICEiT/
├── backend-microservices/
│   ├── eureka-server/                  # Service Registry (:8761)
│   ├── api-gateway/                    # API Gateway + JWT Validation (:8080)
│   ├── user-auth-service/              # Auth, Profiles, RBAC (:8081)
│   ├── booking-catalog-service/        # Catalog, Bookings, Audit (:8082)
│   └── payment-notification-service/   # Payments + Email (:8083)
└── frontend/                           # React.js SPA (:5173)
```

---

## Setup and Installation

### Prerequisites

- Java 21 (JDK 21 LTS)
- Maven 3.9+
- MySQL 8.x
- Node.js 18+ and npm
- Git

---

### Step 1 - Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### Step 2 - Database Setup

Create the following 3 databases in MySQL:

```sql
CREATE DATABASE serviceit_auth_db;
CREATE DATABASE serviceit_booking_db;
CREATE DATABASE serviceit_payment_db;
```

Tables are auto-created by Hibernate on first startup (ddl-auto: update)

---

### Step 3 - Configure Each Microservice

For each microservice, copy the example config and fill in your values:

```bash
cd backend-microservices/user-auth-service/src/main/resources
cp application.yml.example application.yml
```

Services to configure:
- api-gateway
- user-auth-service
- booking-catalog-service
- payment-notification-service

Note: eureka-server has no secrets and needs no configuration.

---

### Step 4 - Required Configuration Values

Fill these in each service's application.yml:

```yaml
# Database (booking and payment services)
spring.datasource.username: YOUR_MYSQL_USERNAME
spring.datasource.password: YOUR_MYSQL_PASSWORD

# JWT (same secret across ALL services)
jwt.secret: YOUR_BASE64_JWT_SECRET

# Gmail SMTP (payment-notification-service only)
spring.mail.username: YOUR_GMAIL_ADDRESS
spring.mail.password: YOUR_GMAIL_APP_PASSWORD

# Razorpay (payment-notification-service only)
razorpay.key.id: YOUR_RAZORPAY_KEY_ID
razorpay.key.secret: YOUR_RAZORPAY_KEY_SECRET
```

Get Gmail App Password: https://myaccount.google.com/apppasswords
Get Razorpay Keys: https://dashboard.razorpay.com/app/keys

---

### Step 5 - Start Backend Services (in this exact order)

```bash
# 1. Eureka Discovery Server (always start first)
cd backend-microservices/eureka-server
./mvnw spring-boot:run

# 2. API Gateway
cd ../api-gateway
./mvnw spring-boot:run

# 3. User Auth Service
cd ../user-auth-service
./mvnw spring-boot:run

# 4. Booking Catalog Service
cd ../booking-catalog-service
./mvnw spring-boot:run

# 5. Payment Notification Service
cd ../payment-notification-service
./mvnw spring-boot:run
```

Verify all services are registered at: http://localhost:8761

---

### Step 6 - Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Service Ports

| Service | Port | URL |
|---|---|---|
| Eureka Discovery Server | 8761 | http://localhost:8761 |
| API Gateway | 8080 | http://localhost:8080 |
| User Auth Service | 8081 | http://localhost:8081 |
| Booking Catalog Service | 8082 | http://localhost:8082 |
| Payment Notification Service | 8083 | http://localhost:8083 |
| React Frontend | 5173 | http://localhost:5173 |

---

## User Roles

| Role | Access |
|---|---|
| Consumer | Search services, book appointments, make payments, track orders |
| Provider | Manage service listings, toggle availability, view assigned bookings |
| Admin | Approve providers, manage catalog, view analytics and audit logs |

---

## Email Notifications Triggered

| Event | Recipients |
|---|---|
| Account Registration | Consumer / Provider |
| Email Verification | Consumer / Provider |
| Password Reset | Consumer / Provider |
| Booking Confirmation | Consumer + Provider |
| Booking Cancellation | Consumer + Provider |

---

## Security

- Passwords hashed using BCrypt
- Stateless authentication via JWT tokens
- Payment verification via HMAC-SHA256 signature
- Global CORS whitelisting at API Gateway
- All sensitive config excluded from repository via .gitignore

---

## License

This project is developed as part of the Post Graduate Diploma in Advanced Computing (PGCP-AC) at C-DAC, [IACSD Akurdi].

---

## Author

**Dhawal Turkar**
PGCP-AC, C-DAC [IACSD]
Email: [dhawalturkar@gmail.com]
LinkedIn: [https://www.linkedin.com/in/dhawal-turkar/]
