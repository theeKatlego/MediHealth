import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  DollarSign,
} from "lucide-react";
import { Appointment, Doctor } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const DoctorDashboard = () => {
  const { state } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!state.user) return;

      try {
        const appointmentsData = await apiService.getAppointments(
          state.user.id,
          "doctor",
        );
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.user]);

  const doctor = state.user as Doctor;

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.preferredTime).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  });

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  );
  const approvedAppointments = appointments.filter(
    (apt) => apt.status === "approved",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );

  const totalRevenue = completedAppointments.reduce(
    (sum, apt) => sum + apt.fee,
    0,
  );

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+2 from yesterday",
    },
    {
      title: "Pending Approvals",
      value: pendingAppointments.length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: "Requires attention",
    },
    {
      title: "Total Patients",
      value: doctor?.totalPatients || 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5 this month",
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue}`,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+12% from last month",
    },
  ];

  const quickActions = [
    {
      title: "Manage Appointments",
      description: "Review and approve pending appointments",
      icon: <Calendar className="h-5 w-5" />,
      href: "/doctor/appointments",
      color: "bg-blue-500 hover:bg-blue-600",
      badge: pendingAppointments.length > 0 ? pendingAppointments.length : null,
    },
    {
      title: "Update Availability",
      description: "Set your working hours and schedule",
      icon: <Clock className="h-5 w-5" />,
      href: "/doctor/availability",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Patient Messages",
      description: "Chat with your patients",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/chat",
      color: "bg-purple-500 hover:bg-purple-600",
      badge: 2,
    },
    {
      title: "Profile Settings",
      description: "Update your professional information",
      icon: <Settings className="h-5 w-5" />,
      href: "/profile",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  const handleAppointmentUpdate = () => {
    // Refresh appointments data
    if (state.user) {
      apiService.getAppointments(state.user.id, "doctor").then(setAppointments);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, Dr. {state.user?.name?.split(" ").slice(-1)}
            </h1>
            <p className="text-gray-600 mt-1">
              {doctor?.specialization} • {doctor?.experience} years experience
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={`${
                doctor?.availability.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {doctor?.availability.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
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
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
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
                    className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow relative"
                  >
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500">
                        {action.badge}
                      </Badge>
                    )}
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
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Link to="/doctor/schedule">
                <Button variant="outline" size="sm">
                  Full Schedule
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 3).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStatusUpdate={handleAppointmentUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No appointments scheduled for today</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Enjoy your free day!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Link to="/doctor/appointments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAppointments.slice(0, 2).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStatusUpdate={handleAppointmentUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No pending appointments</p>
                  <p className="text-sm text-gray-400 mt-1">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {doctor?.rating}/5.0
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on patient feedback
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {completedAppointments.length}
                </div>
                <div className="text-sm text-gray-600">
                  Completed Consultations
                </div>
                <div className="text-xs text-gray-500 mt-1">This month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  95%
                </div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  Patient show-up rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Stethoscope className="h-5 w-5 mr-2" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">
                  Specialization:
                </span>
                <span className="ml-2 text-blue-800">
                  {doctor?.specialization}
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Experience:</span>
                <span className="ml-2 text-blue-800">
                  {doctor?.experience} years
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  Consultation Fee:
                </span>
                <span className="ml-2 text-blue-800">
                  ${doctor?.consultationFee}
                </span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  Total Patients:
                </span>
                <span className="ml-2 text-blue-800">
                  {doctor?.totalPatients}
                </span>
              </div>
            </div>
            {doctor?.qualifications && doctor.qualifications.length > 0 && (
              <div className="mt-3">
                <span className="text-blue-700 font-medium">
                  Qualifications:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doctor.qualifications.map((qual, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-blue-800 border-blue-300"
                    >
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default DoctorDashboard;
