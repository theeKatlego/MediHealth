import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  Award,
} from "lucide-react";
import { Doctor } from "@/types";
import { Link } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
  showBookButton?: boolean;
}

export function DoctorCard({ doctor, showBookButton = true }: DoctorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvailabilityStatus = () => {
    if (!doctor.availability.isAvailable) {
      return { text: "Unavailable", color: "bg-red-100 text-red-800" };
    }
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todaySchedule = doctor.availability.schedule[today];
    if (todaySchedule && todaySchedule.isAvailable) {
      return { text: "Available Today", color: "bg-green-100 text-green-800" };
    }
    return { text: "Available", color: "bg-yellow-100 text-yellow-800" };
  };

  const availability = getAvailabilityStatus();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-500 text-white">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">{doctor.specialization}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {doctor.rating} ({doctor.totalPatients} patients)
              </span>
            </div>
          </div>
          <Badge className={availability.color}>{availability.text}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Qualifications
            </h4>
            <div className="flex flex-wrap gap-1">
              {doctor.qualifications.map((qual, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {doctor.experience} years exp.
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />${doctor.consultationFee}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Today's Schedule
            </h4>
            <div className="text-sm text-gray-600">
              {(() => {
                const today = new Date()
                  .toLocaleDateString("en-US", {
                    weekday: "long",
                  })
                  .toLowerCase();
                const schedule = doctor.availability.schedule[today];
                if (schedule && schedule.isAvailable) {
                  return `${schedule.start} - ${schedule.end}`;
                }
                return "Not available today";
              })()}
            </div>
          </div>
        </div>
      </CardContent>

      {showBookButton && (
        <CardFooter className="pt-0">
          <div className="flex space-x-2 w-full">
            <Link
              to={`/book-appointment?doctorId=${doctor.id}`}
              className="flex-1"
            >
              <Button
                className="w-full"
                disabled={!doctor.availability.isAvailable}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-blue-500 text-white text-lg">
                        {getInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{doctor.name}</h2>
                      <p className="text-lg text-muted-foreground">
                        {doctor.specialization}
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Rating and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">
                          {doctor.rating}
                        </span>
                        <span className="text-muted-foreground">/5.0</span>
                      </div>
                      <Badge className={availability.color}>
                        {availability.text}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${doctor.consultationFee}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Consultation Fee
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Professional Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.experience} years of experience</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.totalPatients} patients treated</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            ${doctor.consultationFee} per consultation
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Qualifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.qualifications.map((qual, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm"
                          >
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Availability Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(doctor.availability.schedule).map(
                        ([day, schedule]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium capitalize">
                              {day}
                            </span>
                            <span
                              className={`text-sm ${schedule.isAvailable ? "text-green-600" : "text-red-600"}`}
                            >
                              {schedule.isAvailable
                                ? `${schedule.start} - ${schedule.end}`
                                : "Unavailable"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.email}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Link
                      to={`/book-appointment?doctorId=${doctor.id}`}
                      className="flex-1"
                    >
                      <Button
                        className="w-full"
                        disabled={!doctor.availability.isAvailable}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
                    <Link to={`/chat?doctorId=${doctor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
