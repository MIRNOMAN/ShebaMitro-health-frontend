# ShebaMitro — Digital Health & Telemedicine Platform

> **Comprehensive Healthcare Ecosystem**: Real-time BMDC Specialist Teleconsultations, Digital Prescription (Rx) Writer, DGDA Verified Model Pharmacy, ISO-Standard Diagnostic Lab Hub, and Patient Health Records.

---

## 🔐 Verified Demo Login Credentials

> [!IMPORTANT]
> **All accounts are pre-verified in the database (`is_verified: true`)**. No OTP or email verification code is required during login. You can sign in immediately using the credentials below.

### 🌟 1. Primary Demo Accounts (Password: `Password123!`)
On the login page ([/login](http://localhost:3000/login)), clicking any role tab automatically pre-fills these credentials:

| Role | Portal URL | Email | Password | Status | Profile Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Patient** | [`/dashboard/patient`](http://localhost:3000/dashboard/patient) | `patient@shebamitro.health` | `Password123!` | `✅ Verified` | Sabbir Ahmed (Patient Profile Active) |
| **Doctor** | [`/dashboard/doctor`](http://localhost:3000/dashboard/doctor) | `doctor@shebamitro.health` | `Password123!` | `✅ Verified` | Prof. Dr. Syed Mahmudul Hasan (BMDC Verified) |
| **Doctor (Teleconsult)** | [`/teleconsult/...`](http://localhost:3000/teleconsult/237d97e7-d190-4137-b22e-3bd090233b86) | `dr.arif@shebamitro.health` | `Password123!` | `✅ Verified` | Dr. Kazi Arif (Pediatrics Specialist) |
| **Pharmacy** | [`/dashboard/pharmacy`](http://localhost:3000/dashboard/pharmacy) | `pharmacy@shebamitro.health` | `Password123!` | `✅ Verified` | Lazz Pharma (Dhanmondi Model Pharmacy) |
| **Diagnostic Lab** | [`/dashboard/lab`](http://localhost:3000/dashboard/lab) | `lab@shebamitro.health` | `Password123!` | `✅ Verified` | Popular Diagnostic Centre (ISO Standard) |
| **Admin** | [`/dashboard/admin`](http://localhost:3000/dashboard/admin) | `admin@shebamitro.health` | `Password123!` | `✅ Verified` | System Administrator (Full Access) |

---

### 🔑 2. Custom Demo Accounts (Password: `$$Baki09$$`)
Dedicated accounts configured with password `$$Baki09$$` and fully verified in PostgreSQL:

| Role | Portal URL | Email | Password | Status | Profile Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Patient** | [`/dashboard/patient`](http://localhost:3000/dashboard/patient) | `rapadi9855@iconcubic.com` | `$$Baki09$$` | `✅ Verified` | Verified Patient Account |
| **Doctor** | [`/dashboard/doctor`](http://localhost:3000/dashboard/doctor) | `doctor.baki@shebamitro.health` | `$$Baki09$$` | `✅ Verified` | Dr. Baki Billah (Cardiology Specialist) |
| **Pharmacy** | [`/dashboard/pharmacy`](http://localhost:3000/dashboard/pharmacy) | `pharmacy.baki@shebamitro.health` | `$$Baki09$$` | `✅ Verified` | Baki Model Pharmacy Hub |
| **Diagnostic Lab** | [`/dashboard/lab`](http://localhost:3000/dashboard/lab) | `lab.baki@shebamitro.health` | `$$Baki09$$` | `✅ Verified` | Baki Clinical Diagnostics Lab |
| **Admin** | [`/dashboard/admin`](http://localhost:3000/dashboard/admin) | `admin.baki@shebamitro.health` | `$$Baki09$$` | `✅ Verified` | Baki Super Admin |

---

## 🚀 Getting Started

### 1. Installation & Setup
```bash
# Frontend (Next.js 16)
cd ShebaMitro-health-frontend
npm install

# Backend (NestJS 11)
cd ../ShebaMitro-health-server
npm install
```

### 2. Run Development Servers
```bash
# Start Frontend (Port 3000)
npm run dev

# Start Backend (Port 5100)
npm run start:dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Login Portal**: [http://localhost:3000/login](http://localhost:3000/login)
- **Backend API Base**: [http://localhost:5100/api/v1](http://localhost:5100/api/v1)
- **Swagger Documentation**: [http://localhost:5100/docs](http://localhost:5100/docs)

---

## 🩺 Core Platform Features

1. **Patient Portal (`/dashboard/patient`)**:
   - Daily Medicine Alarm Deck with voice notes and adherence tracking.
   - Real-time biometric vitals monitoring (Heart Rate, Blood Pressure, Glycemic Level, BMI).
   - Upcoming doctor consultation schedule with direct video teleconsultation access.
   - Diagnostic lab reports download and digital prescription history.

2. **Teleconsultation Room (`/teleconsult/[id]`)**:
   - Encrypted WebRTC audio and video consultation room.
   - Picture-in-Picture local camera preview with hardware mute/unmute controls.
   - Live call duration timer and secure connection indicators.
   - Slide-over In-Call Clinical Chat with file attachments and emergency end session.

3. **Doctor Clinic Portal (`/dashboard/doctor`)**:
   - Real-time OPD patient queue and serial management.
   - Teleconsultation lobby (`/dashboard/doctor/teleconsultation`) with camera check and active queue.
   - Digital Prescription Writer (`/dashboard/doctor/rx-writer`) with cryptographic signing.
   - Consultation analytics and earnings dashboard (`/dashboard/doctor/analytics`).

4. **Pharmacy & Diagnostic Lab Hubs**:
   - Prescription verification and 2-hour express medicine rider dispatch.
   - Lab test requisitions management and direct PDF diagnostic report uploads.
