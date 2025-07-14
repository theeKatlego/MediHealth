import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import {
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const DoctorAppointments = () => {
  const { state } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [state.user]);

  const fetchAppointments = async () => {
    if (!state.user) return;

    try {
      const appointmentsData = await apiService.getAppointments(
        state.user.id,
        "doctor",
      );
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.patientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.patientEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter,
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() + 7);

      filtered = filtered.filter((appointment) => {
        const aptDate = new Date(appointment.preferredTime);
        switch (dateFilter) {
          case "today":
            return aptDate.toDateString() === today.toDateString();
          case "tomorrow":
            return aptDate.toDateString() === tomorrow.toDateString();
          case "this-week":
            return aptDate >= today && aptDate <= thisWeek;
          case "past":
            return aptDate < today;
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const getAppointmentsByStatus = (status: string) => {
    return filteredAppointments.filter((apt) => apt.status === status);
  };

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return filteredAppointments.filter(
      (apt) => new Date(apt.preferredTime).toDateString() === today,
    );
  };

  const allAppointments = filteredAppointments;
  const pendingAppointments = getAppointmentsByStatus("pending");
  const approvedAppointments = getAppointmentsByStatus("approved");
  const todayAppointments = getTodayAppointments();

  const stats = [
    {
      label: "Total",
      count: allAppointments.length,
      color: "bg-blue-100 text-blue-800",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Pending",
      count: pendingAppointments.length,
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Approved",
      count: approvedAppointments.length,
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      label: "Today's",
      count: todayAppointments.length,
      color: "bg-purple-100 text-purple-800",
      icon: <Calendar className="h-4 w-4" />,
    },
  ];

  const handleAppointmentUpdate = () => {
    fetchAppointments();
  };

  const handleBulkApprove = async () => {
    const pendingIds = pendingAppointments.slice(0, 5).map((apt) => apt.id);
    try {
      await Promise.all(
        pendingIds.map((id) =>
          apiService.updateAppointmentStatus(id, "approved"),
        ),
      );
      fetchAppointments();
    } catch (error) {
      console.error("Failed to bulk approve appointments:", error);
    }
  };

  if (isLoading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
              Appointment Management
            </h1>
            <p className="text-gray-600 mt-1">
              Review and manage patient appointments
            </p>
          </div>
          {pendingAppointments.length > 0 && (
            <Button onClick={handleBulkApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Next 5
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.count}
                    </div>
                    <Badge className={stat.color}>{stat.label}</Badge>
                  </div>
                  <div className="text-gray-400">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Priority Actions */}
        {pendingAppointments.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 mb-3">
                You have {pendingAppointments.length} pending appointment
                {pendingAppointments.length !== 1 ? "s" : ""}
                that need your review.
              </p>
              <Button onClick={handleBulkApprove} size="sm">
                Review Pending Appointments
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Appointments Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({allAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="today">
              Today ({todayAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {allAppointments.length > 0 ? (
                allAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusUpdate={handleAppointmentUpdate}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No appointments found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      dateFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "No appointments have been scheduled yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingAppointments.length > 0 ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Pending Appointments:</strong> These appointments
                      require your approval. Review the patient information and
                      symptoms before making a decision.
                    </p>
                  </div>
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStatusUpdate={handleAppointmentUpdate}
                    />
                  ))}
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-600">
                      No pending appointments to review
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="today">
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Today's Schedule:</strong> You have{" "}
                      {todayAppointments.length} appointment
                      {todayAppointments.length !== 1 ? "s" : ""} scheduled for
                      today.
                    </p>
                  </div>
                  {todayAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStatusUpdate={handleAppointmentUpdate}
                    />
                  ))}
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No appointments today
                    </h3>
                    <p className="text-gray-600">Enjoy your free day!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              {approvedAppointments.length > 0 ? (
                approvedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusUpdate={handleAppointmentUpdate}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No approved appointments
                    </h3>
                    <p className="text-gray-600">
                      Approved appointments will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
};

export default DoctorAppointments;
