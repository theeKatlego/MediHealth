export interface User {
  id: string;
  email: string;
  name: string;
  role: "visitor" | "patient" | "doctor";
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
}

export interface Doctor extends User {
  role: "doctor";
  specialization: string;
  qualifications: string[];
  experience: number;
  availability: DoctorAvailability;
  consultationFee: number;
  rating: number;
  totalPatients: number;
}

export interface Patient extends User {
  role: "patient";
  medicalHistory: MedicalRecord[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface DoctorAvailability {
  isAvailable: boolean;
  schedule: WeeklySchedule;
  breaks: TimeSlot[];
}

export interface WeeklySchedule {
  [key: string]: {
    start: string;
    end: string;
    isAvailable: boolean;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
  date: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  symptoms: string;
  preferredTime: string;
  actualTime?: string;
  status: "pending" | "approved" | "declined" | "completed" | "cancelled";
  type: "consultation" | "follow-up" | "emergency";
  fee: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: "prescription" | "visit" | "diagnosis" | "lab-result";
  title: string;
  description: string;
  doctorName: string;
  date: string;
  attachments?: string[];
  metadata?: {
    [key: string]: any;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "text" | "image" | "file";
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  updatedAt: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "appointment" | "chat" | "system" | "payment";
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
  phone?: string;
  specialization?: string;
  qualifications?: string[];
  experience?: number;
}

export interface VisitorAppointmentData {
  patientName: string;
  patientEmail: string;
  symptoms: string;
  preferredTime: string;
  doctorId: string;
}
