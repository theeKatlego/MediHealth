import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Mail,
} from "lucide-react";
import { Appointment } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { toast } from "sonner";

const DoctorSchedule = () => {
  const { state } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    patientEmail: "",
    symptoms: "",
    type: "consultation" as "consultation" | "follow-up" | "emergency",
    notes: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!state.user) return;

      try {
        const appointmentsData = await apiService.getAppointments(
          state.user.id,
          "doctor",
        );
        setAppointments(
          appointmentsData.filter((apt) => apt.status === "approved"),
        );
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [state.user]);

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (date: Date) => {
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.preferredTime);
        return aptDate.toDateString() === date.toDateString();
      })
      .sort(
        (a, b) =>
          new Date(a.preferredTime).getTime() -
          new Date(b.preferredTime).getTime(),
      );
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1),
    );
  };

  const goToToday = () => {
    setSelectedWeek(new Date());
  };

  const handleSlotClick = (date: Date, time: string) => {
    // Check if the slot is already occupied
    const existingAppointment = getAppointmentsForDay(date).find((apt) => {
      const aptTime = formatTime(apt.preferredTime);
      return aptTime === time;
    });

    if (existingAppointment) {
      toast.info("This time slot is already booked");
      return;
    }

    // Check if the time slot is in the past
    const slotDateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);

    if (slotDateTime < new Date()) {
      toast.error("Cannot schedule appointments in the past");
      return;
    }

    setSelectedSlot({ date, time });
    setIsCreateModalOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setAppointmentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAppointment = async () => {
    if (
      !selectedSlot ||
      !appointmentForm.patientName ||
      !appointmentForm.patientEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const appointmentDateTime = new Date(selectedSlot.date);
      const [hours, minutes] = selectedSlot.time.split(":").map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const newAppointment = {
        doctorId: state.user!.id,
        patientName: appointmentForm.patientName,
        patientEmail: appointmentForm.patientEmail,
        symptoms: appointmentForm.symptoms,
        preferredTime: appointmentDateTime.toISOString(),
        type: appointmentForm.type,
        fee: state.user?.consultationFee || 100,
        notes: appointmentForm.notes,
      };

      await apiService.createAppointment(newAppointment);

      // Refresh appointments
      const appointmentsData = await apiService.getAppointments(
        state.user!.id,
        "doctor",
      );
      setAppointments(
        appointmentsData.filter((apt) => apt.status === "approved"),
      );

      // Reset form and close modal
      setAppointmentForm({
        patientName: "",
        patientEmail: "",
        symptoms: "",
        type: "consultation",
        notes: "",
      });
      setIsCreateModalOpen(false);
      setSelectedSlot(null);

      toast.success("Appointment scheduled successfully!");
    } catch (error) {
      toast.error("Failed to schedule appointment");
    }
  };

  if (isLoading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-1">
              Week of {format(weekStart, "MMMM d")} -{" "}
              {format(addDays(weekStart, 6), "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={goToToday}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  appointments.filter((apt) => {
                    const aptDate = new Date(apt.preferredTime);
                    return (
                      aptDate >= weekStart && aptDate <= addDays(weekStart, 6)
                    );
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {getAppointmentsForDay(new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {
                  weekDays.filter(
                    (day) => getAppointmentsForDay(day).length > 0,
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Busy Days</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  appointments
                    .filter((apt) => {
                      const aptDate = new Date(apt.preferredTime);
                      return (
                        aptDate >= weekStart && aptDate <= addDays(weekStart, 6)
                      );
                    })
                    .reduce((sum, apt) => sum + apt.fee, 0),
                )}
              </div>
              <div className="text-sm text-gray-600">Revenue ($)</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {/* Time column header */}
              <div className="text-sm font-medium text-gray-500 p-2">Time</div>

              {/* Day headers */}
              {weekDays.map((day, index) => (
                <div key={index} className="text-center p-2">
                  <div className="text-sm font-medium text-gray-900">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      day.toDateString() === new Date().toDateString()
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getAppointmentsForDay(day).length} appointments
                  </div>
                </div>
              ))}

              {/* Time slots and appointments */}
              {timeSlots.map((timeSlot, timeIndex) => (
                <React.Fragment key={timeIndex}>
                  <div className="text-xs text-gray-500 p-2 border-t">
                    {timeSlot}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const appointmentAtTime = dayAppointments.find((apt) => {
                      const aptTime = formatTime(apt.preferredTime);
                      return aptTime === timeSlot;
                    });

                    return (
                      <div
                        key={dayIndex}
                        className={`p-1 border-t min-h-[40px] cursor-pointer hover:bg-blue-50 transition-colors ${
                          !appointmentAtTime ? "hover:bg-blue-50" : ""
                        }`}
                        onClick={() => handleSlotClick(day, timeSlot)}
                        title={
                          appointmentAtTime
                            ? "Slot occupied"
                            : "Click to schedule appointment"
                        }
                      >
                        {appointmentAtTime ? (
                          <div
                            className={`p-2 rounded text-xs border ${getStatusColor(appointmentAtTime.status)}`}
                          >
                            <div className="font-medium truncate">
                              {appointmentAtTime.patientName}
                            </div>
                            <div className="truncate text-xs opacity-75">
                              {appointmentAtTime.type}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-blue-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Schedule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <Card
                key={index}
                className={isToday ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(day, "EEEE, MMMM d")}
                      {isToday && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                          Today
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {dayAppointments.length} appointments
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {appointment.patientName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {appointment.type} • ${appointment.fee}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(appointment.preferredTime)}
                            </div>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No appointments scheduled</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Appointment Creation Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedSlot && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">
                      {format(selectedSlot.date, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-blue-600">{selectedSlot.time}</div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="patientName"
                    type="text"
                    placeholder="Enter patient name"
                    value={appointmentForm.patientName}
                    onChange={(e) =>
                      handleFormChange("patientName", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientEmail">Patient Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="patientEmail"
                    type="email"
                    placeholder="Enter patient email"
                    value={appointmentForm.patientEmail}
                    onChange={(e) =>
                      handleFormChange("patientEmail", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentType">Appointment Type</Label>
                <Select
                  value={appointmentForm.type}
                  onValueChange={(value) => handleFormChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms/Reason</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Enter symptoms or reason for visit"
                  value={appointmentForm.symptoms}
                  onChange={(e) => handleFormChange("symptoms", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for the appointment"
                  value={appointmentForm.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateAppointment} className="flex-1">
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Sidebar>
  );
};

export default DoctorSchedule;
