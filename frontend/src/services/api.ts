import {
  User,
  Doctor,
  Patient,
  Appointment,
  MedicalRecord,
  ChatMessage,
  Notification,
} from "@/types";

// Mock data for development
export const mockUsers: User[] = [
  {
    id: "doc_1",
    email: "dr.smith@medihealth.com",
    name: "Dr. John Smith",
    role: "doctor",
    phone: "+1-555-0101",
    createdAt: "2024-01-01T00:00:00Z",
    specialization: "Cardiology",
    qualifications: ["MD Cardiology", "FACC"],
    experience: 15,
    availability: {
      isAvailable: true,
      schedule: {
        monday: { start: "08:00", end: "18:00", isAvailable: true },
        tuesday: { start: "08:00", end: "18:00", isAvailable: true },
        wednesday: { start: "08:00", end: "18:00", isAvailable: true },
        thursday: { start: "08:00", end: "18:00", isAvailable: true },
        friday: { start: "08:00", end: "16:00", isAvailable: true },
        saturday: { start: "09:00", end: "13:00", isAvailable: true },
        sunday: { start: "09:00", end: "13:00", isAvailable: false },
      },
      breaks: [],
    },
    consultationFee: 150,
    rating: 4.8,
    totalPatients: 245,
  } as Doctor,
  {
    id: "doc_2",
    email: "dr.johnson@medihealth.com",
    name: "Dr. Sarah Johnson",
    role: "doctor",
    phone: "+1-555-0102",
    createdAt: "2024-01-01T00:00:00Z",
    specialization: "Pediatrics",
    qualifications: ["MD Pediatrics", "FAAP"],
    experience: 12,
    availability: {
      isAvailable: true,
      schedule: {
        monday: { start: "09:00", end: "17:00", isAvailable: true },
        tuesday: { start: "09:00", end: "17:00", isAvailable: true },
        wednesday: { start: "09:00", end: "17:00", isAvailable: true },
        thursday: { start: "09:00", end: "17:00", isAvailable: true },
        friday: { start: "09:00", end: "17:00", isAvailable: true },
        saturday: { start: "10:00", end: "14:00", isAvailable: true },
        sunday: { start: "10:00", end: "14:00", isAvailable: false },
      },
      breaks: [],
    },
    consultationFee: 120,
    rating: 4.9,
    totalPatients: 180,
  } as Doctor,
  {
    id: "pat_1",
    email: "jane.doe@email.com",
    name: "Jane Doe",
    role: "patient",
    phone: "+1-555-0201",
    dateOfBirth: "1990-05-15",
    createdAt: "2024-01-15T00:00:00Z",
    medicalHistory: [
      {
        id: "rec_1",
        patientId: "pat_1",
        type: "diagnosis",
        title: "Annual Checkup",
        description: "Routine physical examination. All vitals normal.",
        doctorName: "Dr. John Smith",
        date: "2024-01-15",
      },
      {
        id: "rec_2",
        patientId: "pat_1",
        type: "prescription",
        title: "Vitamin D Supplement",
        description: "Vitamin D3 1000 IU daily for deficiency",
        doctorName: "Dr. John Smith",
        date: "2024-01-15",
      },
    ],
    emergencyContact: {
      name: "John Doe",
      phone: "+1-555-0202",
      relationship: "Spouse",
    },
  } as Patient,
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt_1",
    patientId: "pat_1",
    doctorId: "doc_1",
    patientName: "Jane Doe",
    patientEmail: "jane.doe@email.com",
    symptoms: "Chest pain and shortness of breath",
    preferredTime: "2024-01-20T10:00:00Z",
    actualTime: "2024-01-20T10:00:00Z",
    status: "approved",
    type: "consultation",
    fee: 150,
    notes: "Regular cardiology consultation",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "apt_2",
    patientId: undefined,
    doctorId: "doc_2",
    patientName: "Robert Wilson",
    patientEmail: "robert.wilson@email.com",
    symptoms: "Child has fever and cough for 3 days",
    preferredTime: "2024-01-21T14:00:00Z",
    status: "pending",
    type: "consultation",
    fee: 120,
    createdAt: "2024-01-19T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    senderId: "pat_1",
    receiverId: "doc_1",
    message: "Hello Dr. Smith, I have a question about my medication.",
    timestamp: "2024-01-20T15:30:00Z",
    isRead: true,
    type: "text",
  },
  {
    id: "msg_2",
    senderId: "doc_1",
    receiverId: "pat_1",
    message:
      "Hello Jane! I'd be happy to help. What specific question do you have?",
    timestamp: "2024-01-20T15:35:00Z",
    isRead: true,
    type: "text",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    userId: "pat_1",
    title: "Appointment Approved",
    message:
      "Your appointment with Dr. John Smith has been approved for Jan 20, 10:00 AM",
    type: "appointment",
    isRead: false,
    actionUrl: "/appointments",
    createdAt: "2024-01-18T12:00:00Z",
  },
];

// API simulation functions
class ApiService {
  async getDoctors(): Promise<Doctor[]> {
    await this.delay();
    return mockUsers.filter((user) => user.role === "doctor") as Doctor[];
  }

  async getDoctor(id: string): Promise<Doctor | null> {
    await this.delay();
    const doctor = mockUsers.find(
      (user) => user.id === id && user.role === "doctor",
    ) as Doctor;
    return doctor || null;
  }

  async getPatientMedicalHistory(
    patientId: string,
    filter?: string,
  ): Promise<MedicalRecord[]> {
    await this.delay();
    const patient = mockUsers.find(
      (user) => user.id === patientId && user.role === "patient",
    ) as Patient;
    if (!patient) return [];

    let records = patient.medicalHistory || [];
    if (filter && filter !== "all") {
      records = records.filter((record) => record.type === filter);
    }
    return records;
  }

  async getAppointments(
    userId: string,
    userRole: string,
  ): Promise<Appointment[]> {
    await this.delay();
    if (userRole === "doctor") {
      return mockAppointments.filter((apt) => apt.doctorId === userId);
    } else if (userRole === "patient") {
      return mockAppointments.filter((apt) => apt.patientId === userId);
    }
    return [];
  }

  async createAppointment(appointmentData: any): Promise<Appointment> {
    await this.delay();
    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: string,
  ): Promise<void> {
    await this.delay();
    const appointment = mockAppointments.find(
      (apt) => apt.id === appointmentId,
    );
    if (appointment) {
      appointment.status = status as any;
      appointment.updatedAt = new Date().toISOString();
    }
  }

  async getChatMessages(
    userId: string,
    otherUserId: string,
  ): Promise<ChatMessage[]> {
    await this.delay();
    return mockChatMessages.filter(
      (msg) =>
        (msg.senderId === userId && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === userId),
    );
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string,
  ): Promise<ChatMessage> {
    await this.delay();
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: "text",
    };
    mockChatMessages.push(newMessage);
    return newMessage;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    await this.delay();
    return mockNotifications.filter((notif) => notif.userId === userId);
  }

  async updateDoctorAvailability(
    doctorId: string,
    availability: any,
  ): Promise<void> {
    await this.delay();
    const doctor = mockUsers.find(
      (user) => user.id === doctorId && user.role === "doctor",
    ) as Doctor;
    if (doctor) {
      doctor.availability = availability;
    }
  }

  async updateUserProfile(userId: string, profileData: any): Promise<User> {
    await this.delay();
    const userIndex = mockUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
      return mockUsers[userIndex];
    }
    throw new Error("User not found");
  }

  private async delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();
