import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { RoleGuard } from "@/components/common/RoleGuard";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/appointments/BookAppointment";

// Patient Pages
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import PatientAppointments from "./pages/patient/Appointments";
import MedicalHistory from "./pages/patient/MedicalHistory";

// Doctor Pages
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorAvailability from "./pages/doctor/Availability";
import DoctorPatients from "./pages/doctor/Patients";

// Shared Pages
import ChatInterface from "./pages/chat/ChatInterface";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/book-appointment" element={<BookAppointment />} />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <RoleGuard allowedRoles={["patient"]}>
                    <PatientDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <RoleGuard allowedRoles={["patient"]}>
                    <PatientAppointments />
                  </RoleGuard>
                }
              />
              <Route
                path="/patient/medical-history"
                element={
                  <RoleGuard allowedRoles={["patient"]}>
                    <MedicalHistory />
                  </RoleGuard>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <RoleGuard allowedRoles={["doctor"]}>
                    <DoctorDashboard />
                  </RoleGuard>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <RoleGuard allowedRoles={["doctor"]}>
                    <DoctorAppointments />
                  </RoleGuard>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <RoleGuard allowedRoles={["doctor"]}>
                    <DoctorSchedule />
                  </RoleGuard>
                }
              />
              <Route
                path="/doctor/availability"
                element={
                  <RoleGuard allowedRoles={["doctor"]}>
                    <DoctorAvailability />
                  </RoleGuard>
                }
              />
              <Route
                path="/doctor/patients"
                element={
                  <RoleGuard allowedRoles={["doctor"]}>
                    <DoctorPatients />
                  </RoleGuard>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/chat"
                element={
                  <RoleGuard allowedRoles={["patient", "doctor"]}>
                    <ChatInterface />
                  </RoleGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <RoleGuard allowedRoles={["patient", "doctor"]}>
                    <Profile />
                  </RoleGuard>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
