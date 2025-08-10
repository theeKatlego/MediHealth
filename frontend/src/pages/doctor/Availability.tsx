import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Calendar,
  Coffee,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Doctor, DoctorAvailability } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const DoctorAvailabilityPage = () => {
  const { state, updateUser } = useAuth();
  const doctor = state.user as Doctor;

  const [availability, setAvailability] = useState<DoctorAvailability>(
    doctor?.availability || {
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
  );

  const [newBreak, setNewBreak] = useState({
    start: "",
    end: "",
    date: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const weekDays = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const updateSchedule = (
    day: string,
    field: string,
    value: string | boolean,
  ) => {
    setAvailability((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
    setUnsavedChanges(true);
  };

  const updateGeneralAvailability = (isAvailable: boolean) => {
    setAvailability((prev) => ({
      ...prev,
      isAvailable,
    }));
    setUnsavedChanges(true);
  };

  const addBreak = () => {
    if (!newBreak.start || !newBreak.end || !newBreak.date) {
      toast.error("Please fill in all break details");
      return;
    }

    const breakEntry = {
      start: newBreak.start,
      end: newBreak.end,
      date: newBreak.date,
      reason: newBreak.reason || "Break",
    };

    setAvailability((prev) => ({
      ...prev,
      breaks: [...prev.breaks, breakEntry],
    }));

    setNewBreak({ start: "", end: "", date: "", reason: "" });
    setUnsavedChanges(true);
    toast.success("Break added successfully");
  };

  const removeBreak = (index: number) => {
    setAvailability((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== index),
    }));
    setUnsavedChanges(true);
    toast.success("Break removed");
  };

  const saveAvailability = async () => {
    setIsLoading(true);
    try {
      await apiService.updateDoctorAvailability(doctor.id, availability);

      // Update the user in context with new availability
      const updatedDoctor = { ...doctor, availability };
      updateUser(updatedDoctor);

      setUnsavedChanges(false);
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkingHours = (day: string) => {
    const daySchedule = availability.schedule[day];
    if (!daySchedule.isAvailable) return "Not available";
    return `${daySchedule.start} - ${daySchedule.end}`;
  };

  const getTotalWorkingHours = () => {
    let totalMinutes = 0;
    Object.values(availability.schedule).forEach((daySchedule) => {
      if (daySchedule.isAvailable) {
        const start = new Date(`2000-01-01T${daySchedule.start}:00`);
        const end = new Date(`2000-01-01T${daySchedule.end}:00`);
        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
      }
    });
    return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Availability Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your working hours and schedule
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {unsavedChanges && (
              <Badge variant="destructive">Unsaved Changes</Badge>
            )}
            <Button
              onClick={saveAvailability}
              disabled={isLoading || !unsavedChanges}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Overall Availability Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                General Availability
              </div>
              <Badge
                className={
                  availability.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {availability.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="general-availability" className="text-base">
                  Accept new appointments
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  When disabled, patients won't be able to book new appointments
                  with you
                </p>
              </div>
              <Switch
                id="general-availability"
                checked={availability.isAvailable}
                onCheckedChange={updateGeneralAvailability}
              />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Schedule
              </div>
              <div className="text-sm text-gray-600">
                Total: {getTotalWorkingHours()} hours/week
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDays.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="w-24">
                    <Label className="font-medium">{label}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={availability.schedule[key].isAvailable}
                      onCheckedChange={(checked) =>
                        updateSchedule(key, "isAvailable", checked)
                      }
                    />
                    <Label className="text-sm">Available</Label>
                  </div>

                  {availability.schedule[key].isAvailable && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">From:</Label>
                        <Input
                          type="time"
                          value={availability.schedule[key].start}
                          onChange={(e) =>
                            updateSchedule(key, "start", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">To:</Label>
                        <Input
                          type="time"
                          value={availability.schedule[key].end}
                          onChange={(e) =>
                            updateSchedule(key, "end", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex-1">
                    <Badge variant="outline" className="text-xs">
                      {getWorkingHours(key)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breaks and Time Off */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coffee className="h-5 w-5 mr-2" />
              Breaks & Time Off
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add New Break */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Label className="text-base font-medium mb-3 block">
                Add Break/Time Off
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Date</Label>
                  <Input
                    type="date"
                    value={newBreak.date}
                    onChange={(e) =>
                      setNewBreak((prev) => ({ ...prev, date: e.target.value }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label className="text-sm">Start Time</Label>
                  <Input
                    type="time"
                    value={newBreak.start}
                    onChange={(e) =>
                      setNewBreak((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm">End Time</Label>
                  <Input
                    type="time"
                    value={newBreak.end}
                    onChange={(e) =>
                      setNewBreak((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm">Reason (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Lunch, Meeting"
                    value={newBreak.reason}
                    onChange={(e) =>
                      setNewBreak((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button onClick={addBreak} className="mt-3" size="sm">
                Add Break
              </Button>
            </div>

            {/* Existing Breaks */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Scheduled Breaks
              </Label>
              {availability.breaks.length > 0 ? (
                <div className="space-y-3">
                  {availability.breaks.map((breakItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">
                            {new Date(breakItem.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {breakItem.start} - {breakItem.end}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {breakItem.reason || "Break"}
                        </Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeBreak(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coffee className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No breaks scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">Extended Hours</h3>
              <p className="text-sm text-gray-600 mt-1">
                Open early or stay late for urgent appointments
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Weekend Hours</h3>
              <p className="text-sm text-gray-600 mt-1">
                Offer weekend consultations for busy patients
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Coffee className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-medium">Emergency Hours</h3>
              <p className="text-sm text-gray-600 mt-1">
                Set availability for emergency consultations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">
                  Availability Summary
                </h3>
                <div className="text-sm text-blue-800 mt-1 space-y-1">
                  <p>
                    • Status:{" "}
                    {availability.isAvailable
                      ? "Accepting appointments"
                      : "Not accepting appointments"}
                  </p>
                  <p>
                    • Working days:{" "}
                    {
                      Object.values(availability.schedule).filter(
                        (day) => day.isAvailable,
                      ).length
                    }{" "}
                    days/week
                  </p>
                  <p>• Total hours: {getTotalWorkingHours()} hours/week</p>
                  <p>• Scheduled breaks: {availability.breaks.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {unsavedChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Remember to save your availability
              settings before leaving this page.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Sidebar>
  );
};

export default DoctorAvailabilityPage;
