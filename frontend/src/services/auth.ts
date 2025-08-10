import { User, LoginCredentials, RegisterData } from "@/types";
import { mockUsers } from "./api";

class AuthService {
  async login(email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find user by email (mock authentication)
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === "password") {
      return user;
    }
    return null;
  }

  async register(data: RegisterData): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    // Add role-specific data
    if (data.role === "doctor") {
      Object.assign(newUser, {
        specialization: data.specialization || "General Medicine",
        qualifications: data.qualifications || [],
        experience: data.experience || 0,
        availability: {
          isAvailable: true,
          schedule: {
            monday: { start: "09:00", end: "17:00", isAvailable: true },
            tuesday: { start: "09:00", end: "17:00", isAvailable: true },
            wednesday: { start: "09:00", end: "17:00", isAvailable: true },
            thursday: { start: "09:00", end: "17:00", isAvailable: true },
            friday: { start: "09:00", end: "17:00", isAvailable: true },
            saturday: { start: "09:00", end: "13:00", isAvailable: true },
            sunday: { start: "09:00", end: "13:00", isAvailable: false },
          },
          breaks: [],
        },
        consultationFee: 100,
        rating: 4.5,
        totalPatients: 0,
      });
    } else if (data.role === "patient") {
      Object.assign(newUser, {
        medicalHistory: [],
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
      });
    }

    // Add to mock users array
    mockUsers.push(newUser);

    return newUser;
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  getCurrentUser(): User | null {
    const storedUser = localStorage.getItem("medihealth_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
