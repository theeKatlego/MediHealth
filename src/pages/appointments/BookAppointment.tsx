import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DoctorCard } from "@/components/appointments/DoctorCard";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Doctor, VisitorAppointmentData } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    patientName: state.user?.name || "",
    patientEmail: state.user?.email || "",
    symptoms: "",
  });

  const doctorId = searchParams.get("doctorId");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await apiService.getDoctors();
        setDoctors(doctorsData);

        // If doctorId is provided, pre-select that doctor
        if (doctorId) {
          const doctor = doctorsData.find((d) => d.id === doctorId);
          if (doctor) {
            setSelectedDoctor(doctor);
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, [doctorId]);

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const appointmentData: VisitorAppointmentData = {
        doctorId: selectedDoctor.id,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        symptoms: formData.symptoms,
        preferredTime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          parseInt(selectedTime.split(":")[0]),
          parseInt(selectedTime.split(":")[1]),
        ).toISOString(),
      };

      const appointment = await apiService.createAppointment({
        ...appointmentData,
        type: appointmentType,
        fee: selectedDoctor.consultationFee,
        patientId: state.user?.id,
      });

      setSuccess(true);
      toast.success("Appointment booked successfully!");

      // Redirect after success
      setTimeout(() => {
        if (state.isAuthenticated) {
          navigate(
            state.user?.role === "patient" ? "/patient/appointments" : "/",
          );
        } else {
          navigate("/login");
        }
      }, 3000);
    } catch (error) {
      setError("Failed to book appointment. Please try again.");
      toast.error("Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Booked Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your appointment request has been submitted to Dr.{" "}
                {selectedDoctor?.name}. You will receive a confirmation email
                once the doctor approves your appointment.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Doctor:</strong> {selectedDoctor?.name}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {selectedDate && format(selectedDate, "PPP")}
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedTime}
                  </div>
                  <div>
                    <strong>Type:</strong> {appointmentType}
                  </div>
                  <div>
                    <strong>Fee:</strong> ${selectedDoctor?.consultationFee}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {state.isAuthenticated ? (
                  <Button onClick={() => navigate("/patient/appointments")}>
                    View My Appointments
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")}>
                    Login to Track Appointment
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Book an Appointment
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule a consultation with one of our qualified doctors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctor Selection */}
          <div className="space-y-6">
            {!selectedDoctor ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">
                              {doctor.specialization}
                            </p>
                            <div className="flex items-center mt-1">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm">
                                ${doctor.consultationFee}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              doctor.availability.isAvailable
                                ? "default"
                                : "secondary"
                            }
                          >
                            {doctor.availability.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Selected Doctor</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Change Doctor
                  </Button>
                </div>
                <DoctorCard doctor={selectedDoctor} showBookButton={false} />
              </div>
            )}
          </div>

          {/* Appointment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Patient Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="patientName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="patientName"
                          type="text"
                          placeholder="Enter patient name"
                          value={formData.patientName}
                          onChange={(e) =>
                            handleInputChange("patientName", e.target.value)
                          }
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="patientEmail"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.patientEmail}
                          onChange={(e) =>
                            handleInputChange("patientEmail", e.target.value)
                          }
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">
                        Symptoms/Reason for Visit
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                        <Textarea
                          id="symptoms"
                          placeholder="Describe your symptoms or reason for consultation"
                          value={formData.symptoms}
                          onChange={(e) =>
                            handleInputChange("symptoms", e.target.value)
                          }
                          className="pl-10"
                          required
                          disabled={isLoading}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <Select
                      value={appointmentType}
                      onValueChange={setAppointmentType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">
                          Consultation
                        </SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                          disabled={!selectedDoctor}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger disabled={!selectedDate}>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fee Information */}
                  {selectedDoctor && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Consultation Fee:
                        </span>
                        <span className="text-lg font-semibold text-blue-600">
                          ${selectedDoctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !selectedDoctor}
                  >
                    {isLoading ? "Booking Appointment..." : "Book Appointment"}
                  </Button>

                  {!state.isAuthenticated && (
                    <div className="text-sm text-gray-600 text-center">
                      <p>
                        Have an account?{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate("/login")}
                        >
                          Login
                        </Button>{" "}
                        to track your appointments
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
