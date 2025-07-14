import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Check,
  X,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import { Appointment } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusUpdate?: () => void;
}

export function AppointmentCard({
  appointment,
  onStatusUpdate,
}: AppointmentCardProps) {
  const { state } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const isDoctor = state.user?.role === "doctor";
  const canManageAppointment = isDoctor && appointment.status === "pending";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (status: "approved" | "declined") => {
    setIsUpdating(true);
    try {
      await apiService.updateAppointmentStatus(appointment.id, status);
      toast.success(`Appointment ${status} successfully`);
      onStatusUpdate?.();
    } catch (error) {
      toast.error(`Failed to ${status} appointment`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(appointment.patientName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {appointment.patientName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {appointment.patientEmail}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(appointment.preferredTime)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(appointment.preferredTime)}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Symptoms/Reason
          </h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            {appointment.symptoms}
          </p>
        </div>

        {/* Type and Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Type: </span>
            <Badge variant="outline" className="text-xs">
              {appointment.type.charAt(0).toUpperCase() +
                appointment.type.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />${appointment.fee}
          </div>
        </div>

        {/* Notes (if any) */}
        {appointment.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {canManageAppointment && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" disabled={isUpdating}>
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this appointment with{" "}
                      {appointment.patientName}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusUpdate("approved")}
                    >
                      Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" disabled={isUpdating}>
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Decline Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to decline this appointment with{" "}
                      {appointment.patientName}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusUpdate("declined")}
                    >
                      Decline
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {appointment.status === "approved" && (
            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          )}
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <div>Created: {new Date(appointment.createdAt).toLocaleString()}</div>
          {appointment.updatedAt !== appointment.createdAt && (
            <div>
              Updated: {new Date(appointment.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
