# MediHealth - Patient Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2.2-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.11-cyan?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</div>

<p align="center">
  <strong>A comprehensive, role-based patient management system designed to facilitate seamless interaction between patients, doctors, and visitors.</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [User Roles & Functionality](#user-roles--functionality)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Demo Credentials](#demo-credentials)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🏥 Overview

**MediHealth** is a modern, production-ready patient management system built with React and TypeScript. The application supports multiple user roles (Visitors, Patients, Doctors) and provides comprehensive healthcare management features including appointment booking, medical history tracking, real-time communication, and professional healthcare provider tools.

### 🎯 Key Objectives

- **Streamline Healthcare Operations**: Simplify appointment booking and patient management
- **Enhance Communication**: Enable real-time chat between patients and doctors
- **Centralize Medical Records**: Secure storage and easy access to medical history
- **Role-Based Access**: Tailored experiences for different user types
- **Modern User Experience**: Clean, responsive, and accessible interface

---

## ✨ Features

### 👥 Multi-Role Support

#### **🔍 Visitors (Non-registered users)**

- Browse available doctors with advanced filtering
- Book appointments without registration
- View doctor profiles and specializations
- Access public healthcare information

#### **🏥 Patients (Registered users)**

- Personalized healthcare dashboard
- Complete medical history management
- Appointment booking with real-time availability
- Secure messaging with healthcare providers
- Profile and emergency contact management
- Notification system for updates

#### **👨‍⚕️ Doctors (Healthcare providers)**

- Professional practice dashboard with analytics
- Patient management and communication tools
- Appointment approval and scheduling system
- Availability and working hours management
- Weekly schedule views with calendar integration
- Patient medical record access

### 🔧 Core Functionality

- **Authentication & Authorization**: Secure role-based access control
- **Appointment Management**: Complete booking, approval, and tracking system
- **Real-time Communication**: Chat interface between patients and doctors
- **Medical Records**: Comprehensive history tracking and management
- **Responsive Design**: Mobile-first approach with full device compatibility
- **Search & Filtering**: Advanced search capabilities across all features

---

## 🛠 Tech Stack

### **Frontend Framework**

- **React 18.3.1** - Modern React with hooks and context
- **TypeScript 5.5.3** - Type-safe development
- **Vite 6.2.2** - Fast build tool and development server

### **Styling & UI**

- **TailwindCSS 3.4.11** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Framer Motion 12.6.2** - Smooth animations and transitions

### **Routing & State Management**

- **React Router DOM 6.26.2** - Client-side routing
- **React Query 5.56.2** - Server state management
- **React Context API** - Application state management

### **Development Tools**

- **ESLint & Prettier** - Code linting and formatting
- **Vitest 3.1.4** - Unit testing framework
- **TypeScript** - Static type checking
- **PostCSS & Autoprefixer** - CSS processing

### **Additional Libraries**

- **React Hook Form 7.53.0** - Form management
- **Zod 3.23.8** - Schema validation
- **Date-fns 3.6.0** - Date manipulation
- **Sonner** - Toast notifications

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for cloning the repository)

### Check your versions:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medihealth
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Setup (Optional)

Create a `.env.local` file in the root directory for any environment variables:

```env
# Add any environment variables here
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=MediHealth
```

---

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will start on `http://localhost:5173` (or another available port).

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Formatting

```bash
# Format code with Prettier
npm run format.fix

# Type checking
npm run typecheck
```

---

## 👤 User Roles & Functionality

### 🔍 **Visitor Features**

- **Doctor Discovery**: Browse and search healthcare providers
- **Quick Booking**: Schedule appointments without registration
- **Provider Profiles**: View detailed doctor information and availability
- **Public Access**: No login required for basic features

### 🏥 **Patient Features**

- **Personal Dashboard**: Health overview and quick actions
- **Medical History**: Complete record management with filtering
- **Appointment Management**: Book, track, and manage appointments
- **Secure Messaging**: Chat with assigned healthcare providers
- **Profile Management**: Personal and emergency contact information
- **Notifications**: Real-time updates and reminders

### 👨‍⚕️ **Doctor Features**

- **Practice Dashboard**: Analytics and patient overview
- **Patient Management**: Comprehensive patient database
- **Appointment Control**: Approve, decline, and manage appointments
- **Schedule Management**: Set availability and working hours
- **Communication Tools**: Chat with patients and manage inquiries
- **Professional Profile**: Manage qualifications and specializations

---

## 📁 Project Structure

```
medihealth/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (buttons, cards, etc.)
│   │   ├── layout/         # Layout components (navbar, sidebar)
│   │   ├── appointments/   # Appointment-related components
│   │   ├── chat/          # Chat and messaging components
│   │   ├── medical/       # Medical record components
│   │   └── common/        # Shared components
│   ├── pages/              # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── patient/       # Patient-specific pages
│   │   ├── doctor/        # Doctor-specific pages
│   │   └── chat/          # Chat interface
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services and utilities
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
├── tests/                  # Test files
└── docs/                   # Documentation
```

---

## 🔑 Key Components

### **Authentication System**

- Role-based access control
- Secure login/logout functionality
- Protected routes and navigation
- Context-based state management

### **Dashboard Components**

- **PatientDashboard**: Health overview, quick actions, recent activity
- **DoctorDashboard**: Practice analytics, appointment management, patient overview

### **Appointment Management**

- **BookAppointment**: Multi-step booking process with doctor selection
- **AppointmentCard**: Comprehensive appointment display and management
- **DoctorCard**: Professional profiles with availability status

### **Communication System**

- **ChatInterface**: Real-time messaging between patients and doctors
- **MessageBubble**: Styled message components with role indicators

### **Medical Records**

- **MedicalHistory**: Filterable record management
- **MedicalRecordCard**: Detailed record display with attachments

---

## 🔐 Demo Credentials

For testing purposes, use these credentials:

### Doctor Account

- **Email**: `dr.smith@medihealth.com`
- **Password**: `password`
- **Role**: Cardiology Specialist

### Patient Account

- **Email**: `jane.doe@email.com`
- **Password**: `password`
- **Role**: Registered Patient

> **Note**: All demo accounts use the password `password` for simplicity.

---

## 📜 Scripts

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production         |
| `npm run preview`    | Preview production build     |
| `npm test`           | Run tests                    |
| `npm run format.fix` | Format code with Prettier    |
| `npm run typecheck`  | Run TypeScript type checking |

---

## 🌟 Features in Detail

### **Real-time Features**

- Live appointment status updates
- Instant messaging between users
- Real-time availability checking
- Dynamic schedule management

### **Security Features**

- Role-based route protection
- Secure authentication flow
- Input validation and sanitization
- Protected API endpoints (ready for backend)

### **Accessibility Features**

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast design options

### **Performance Features**

- Lazy loading for optimal performance
- Optimized bundle size
- Efficient re-rendering
- Fast development server

---

## 🤝 Contributing

We welcome contributions to MediHealth! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes and commit**: `git commit -m 'Add some feature'`
4. **Push to the branch**: `git push origin feature/your-feature-name`
5. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain responsive design principles
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@medihealth.com or create an issue in the repository.

---

<div align="center">
  <p><strong>Built with ❤️ for better healthcare management</strong></p>
  <p>© 2024 MediHealth. All rights reserved.</p>
</div>
