import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { MedicalRecordCard } from "@/components/medical/MedicalRecordCard";
import {
  Calendar,
  Clock,
  FileText,
  MessageCircle,
  User,
  Bell,
  Plus,
  Activity,
  Heart,
} from "lucide-react";
import { Appointment, MedicalRecord } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const PatientDashboard = () => {
  const { state } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!state.user) return;

      try {
        const [appointmentsData, recordsData] = await Promise.all([
          apiService.getAppointments(state.user.id, "patient"),
          apiService.getPatientMedicalHistory(state.user.id),
        ]);

        setAppointments(appointmentsData);
        setRecentRecords(recordsData.slice(0, 3)); // Show only recent 3 records
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.user]);

  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.status === "approved" && new Date(apt.preferredTime) > new Date(),
  );

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  );

  const stats = [
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Medical Records",
      value: recentRecords.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Unread Messages",
      value: 2,
      icon: <MessageCircle className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule a consultation with a doctor",
      icon: <Calendar className="h-5 w-5" />,
      href: "/book-appointment",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Medical History",
      description: "Access your medical records and history",
      icon: <FileText className="h-5 w-5" />,
      href: "/patient/medical-history",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Chat with Doctor",
      description: "Message your assigned healthcare provider",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/chat",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Update Profile",
      description: "Manage your personal information",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  if (isLoading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {state.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your health dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`p-3 rounded-full text-white ${action.color}`}
                    >
                      {action.icon}
                    </div>
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Link to="/patient/appointments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 2).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Link to="/book-appointment">
                    <Button size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Medical Records</CardTitle>
              <Link to="/patient/medical-history">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No medical records yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your medical history will appear here after consultations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Tips or Notifications */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Heart className="h-5 w-5 mr-2" />
              Health Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">
              Remember to stay hydrated! Aim for 8 glasses of water daily to
              maintain optimal health. Regular hydration supports your immune
              system and helps your body function at its best.
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Appointment approved with Dr. Smith
                </span>
                <span className="text-gray-400 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">New medical record added</span>
                <span className="text-gray-400 ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  Profile updated successfully
                </span>
                <span className="text-gray-400 ml-auto">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default PatientDashboard;
