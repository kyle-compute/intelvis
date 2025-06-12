# IntelVis System Overview

**A comprehensive guide to the IntelVis leak detection platform architecture, codebase, and deployment.**

---

## 🎯 Project Purpose

IntelVis is an industrial leak detection platform that uses wireless sensors to monitor compressed air systems 24/7. The system detects air leaks in real-time, calculates their cost impact, and alerts facility managers instantly—eliminating the need for manual audits and preventing costly energy waste.

---

## 🏗️ System Architecture

The IntelVis system consists of four main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ESP32 Sensors │───▶│   Web Platform  │───▶│   TimescaleDB   │
│  (IoT Devices)  │    │  (Full Stack)   │    │ (Time Series)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Dashboard     │
                       │  (React/Next)   │
                       └─────────────────┘
```

---

## 📁 Project Structure

```
intelvis/
├── parent/                    # ESP32 sensor firmware (Arduino/PlatformIO)
│   ├── src/main.cpp          # Device provisioning & sensor logic
│   └── platformio.ini        # Hardware configuration
├── web/                      # Web application (Full stack)
│   ├── frontend/             # Next.js React frontend
│   ├── backend/              # Express.js API server
│   ├── docker-compose.prod.yml  # Production deployment
│   └── Caddyfile            # Reverse proxy configuration
├── treelink/                 # [Unknown component]
├── README.md                 # Basic project info
└── deploy.md                 # Production deployment guide
```

---

## 🔧 Hardware Component (ESP32 Sensors)

### Location: `/parent/`

**Purpose:** WiFi-enabled sensors that monitor for ultrasonic leak signatures

### Key Features:
- **Device Provisioning**: Automatically registers new sensors with the platform
- **WiFi Connectivity**: Connects to facility networks
- **MAC-based Identity**: Uses device MAC address as unique identifier
- **API Communication**: POSTs to `/api/provision` endpoint

### Core Functionality (`main.cpp`):
```cpp
// 1. Connect to WiFi network
// 2. Get device MAC address
// 3. Call provisionDevice() to register with platform
// 4. Main sensor logic (placeholder for leak detection)
```

### Provisioning Flow:
1. ESP32 boots and connects to WiFi
2. Extracts MAC address: `WiFi.macAddress()`
3. POSTs to `https://intelvis.ai/api/provision` with API key
4. Backend creates Device + NIC records in database
5. Device is ready for user pairing

---

## 🌐 Backend Component (API Server)

### Location: `/web/backend/`

**Tech Stack:** Node.js + Express.js + Prisma + PostgreSQL/TimescaleDB

### Core Dependencies:
- **Express.js**: Web framework
- **Prisma**: Database ORM with migrations
- **bcryptjs**: Password hashing
- **jsonwebtoken**: Authentication tokens
- **cookie-parser**: Session management

### Database Schema (`prisma/schema.prisma`):

```prisma
User {
  id, email, password
  devices: Device[]
}

Device {
  id, ownerId?, status, alias?
  nic: Nic?
  telemetry: Telemetry[]
}

Nic {
  id, mac (unique)
  device: Device?
}

Telemetry {
  deviceId, eventTs, leakRate, pressure
  // Time-series data for leak measurements
}
```

### API Endpoints:

#### Authentication (`/api/auth/`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user (sets HTTP-only cookie)
- `GET /me` - Get current user info
- `POST /logout` - Clear authentication

#### Device Management (`/api/devices/`)
- `GET /` - List user's paired devices
- `POST /` - Pair device by MAC address

#### Provisioning (`/api/provision/`)
- `POST /` - Register new sensor (requires API key)

### Security Features:
- **JWT Authentication**: HTTP-only cookies prevent XSS
- **Password Hashing**: bcrypt with salt rounds
- **API Key Protection**: Provisioning endpoint secured
- **CORS Configuration**: Restricts cross-origin requests
- **Input Validation**: MAC address formatting and validation

### Error Handling:
- Global error middleware catches all unhandled errors
- Comprehensive logging for debugging
- Graceful error responses for client consumption

---

## 💻 Frontend Component (Web Dashboard)

### Location: `/web/frontend/`

**Tech Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS

### Key Dependencies:
- **Next.js**: React framework with SSR/SSG
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first styling
- **React Three Fiber**: 3D model visualization
- **Swiper**: Image carousel component
- **Sonner**: Toast notifications
- **Radix UI**: Accessible component primitives

### Application Structure:

#### Pages (`app/`):
- **`/`** - Landing page with product info and early access form
- **`/login`** - User authentication
- **`/register`** - User registration
- **`/dashboard`** - Device management interface

#### Components (`components/`):
- **`landing/`** - Marketing site components
  - `HeroSection.tsx` - Main value proposition
  - `HowItWorksSection.tsx` - Product explanation
  - `ImageCarousel.tsx` - Hardware photos
  - `ModelViewer.tsx` - 3D sensor model
- **`ui/`** - Reusable interface components
  - `navbar.tsx` - Navigation with auth state
  - Form components (input, button, etc.)

#### Context (`context/`):
- **`AuthContext.tsx`** - Global authentication state management

#### Utilities (`lib/`):
- **`useScrollAnimation.ts`** - Scroll-triggered animations
- **`utils.ts`** - Tailwind class merging

#### Types (`types/`):
- **`index.ts`** - Shared TypeScript interfaces

### Key Features:
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Authentication Flow**: Cookie-based sessions with protected routes
- **Device Pairing**: MAC address input for sensor claiming
- **Real-time Updates**: Toast notifications for user feedback
- **3D Visualization**: Interactive sensor model
- **Scroll Animations**: Intersection Observer-based effects

### Authentication Flow:
1. User logs in → JWT stored in HTTP-only cookie
2. `AuthContext` checks authentication on page load
3. Protected routes redirect unauthenticated users
4. Dashboard shows user-specific devices

### Device Pairing Flow:
1. User enters MAC address in dashboard
2. Frontend POSTs to `/api/devices` with MAC
3. Backend finds unowned device with matching MAC
4. Device ownership transferred to current user
5. Device appears in user's dashboard

---

## 🚀 Infrastructure & Deployment

### Production Architecture:

```
Internet ─▶ Caddy (HTTPS/Routing) ─┬─▶ Frontend (Next.js:3000)
                                   └─▶ Backend (Express:3001) ─▶ TimescaleDB
```

### Deployment Stack:
- **Docker Compose**: Container orchestration
- **Caddy**: Reverse proxy with automatic HTTPS
- **TimescaleDB**: PostgreSQL with time-series extensions
- **DigitalOcean**: Cloud hosting platform

### Configuration Files:

#### `docker-compose.prod.yml`:
- **Caddy**: Handles SSL certificates and routing
- **Frontend**: Next.js application container
- **Backend**: Express.js API container  
- **Database**: TimescaleDB for time-series telemetry

#### `Caddyfile`:
```
intelvis.ai {
  handle_path /api/* {
    reverse_proxy backend:3001
  }
  handle {
    reverse_proxy frontend:3000
  }
}
```

### Environment Variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Token signing key
- `PROVISIONING_API_KEY`: Sensor authentication
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint

### Deployment Process:
1. Clone repository to DigitalOcean droplet
2. Configure environment variables
3. Run `docker-compose up --build -d`
4. Apply database migrations with Prisma
5. Site live at `https://intelvis.ai`

---

## 🔄 Data Flow

### Device Provisioning:
```
ESP32 → WiFi → /api/provision → Create Device+NIC → Database
```

### User Registration:
```
Frontend → /api/auth/register → Hash Password → Store User → Database
```

### Device Pairing:
```
Dashboard → /api/devices (POST MAC) → Find Device → Update Owner → Database
```

### Authentication:
```
Login → /api/auth/login → JWT Cookie → Frontend State → Protected Routes
```

### Future Telemetry Flow:
```
ESP32 Sensors → /api/telemetry → TimescaleDB → Dashboard Charts
```

---

## 🛠️ Development Workflow

### Backend Development:
```bash
cd web/backend
npm install
npm run dev  # Starts Express server on :3001
```

### Frontend Development:
```bash
cd web/frontend
npm install
npm run dev  # Starts Next.js on :3000
```

### Database Management:
```bash
cd web/backend
npx prisma migrate dev     # Apply schema changes
npx prisma studio         # Database GUI
npx prisma generate       # Regenerate client
```

### ESP32 Development:
```bash
cd parent
pio run --target upload    # Flash firmware to device
pio device monitor         # View serial output
```

---

## 🧪 Testing & Quality

### Build Verification:
- **Frontend**: `npm run build` - TypeScript compilation + optimization
- **Backend**: Manual testing of API endpoints
- **Linting**: ESLint for code quality

### Production Deployment Testing:
- Health check endpoint: `/api/health`
- Database connectivity verification
- HTTPS certificate validation

---

## 🔐 Security Considerations

### Authentication:
- HTTP-only cookies prevent XSS attacks
- JWT tokens with 7-day expiration
- bcrypt password hashing with salt

### API Security:
- CORS configuration restricts origins
- Provisioning API key for sensor registration
- Input validation and sanitization

### Infrastructure:
- Automatic HTTPS via Caddy + Let's Encrypt
- Database access restricted to backend container
- Non-root user for production deployment

---

## 📋 Current Status & Technical Debt

### Implemented Features:
✅ User authentication and registration  
✅ Device provisioning and pairing  
✅ ESP32 sensor communication  
✅ Production deployment pipeline  
✅ Responsive web interface  

### Pending Implementation:
🔄 Actual leak detection algorithms  
🔄 Telemetry data collection  
🔄 Real-time dashboard charts  
🔄 Alert/notification system  
🔄 Cost calculation engine  

### Known Issues:
- Domain routing may redirect to `/login` (web server config)
- Limited error handling in ESP32 firmware
- Placeholder content in some landing page sections
- Previous extreme struggle with database migration

---

## 🎯 Next Development Priorities

1. **Telemetry Pipeline**: Implement actual sensor data collection
2. **Dashboard Analytics**: Real-time charts and leak visualization  
3. **Alert System**: Email/SMS notifications for detected leaks
4. **Mobile App**: React Native companion app
5. **Advanced Features**: Cost calculations, predictive analytics

---

*This documentation reflects the current state of the IntelVis system as of January 2025. For the most up-to-date information, refer to the codebase and recent commit history.*