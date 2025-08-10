import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { Calendar, Plus, Filter, Search } from "lucide-react";
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

const PatientAppointments = () => {
  const { state } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!state.user) return;

      try {
        const appointmentsData = await apiService.getAppointments(
          state.user.id,
          "patient",
        );
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [state.user]);

  useEffect(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.patientName
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

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const getAppointmentsByStatus = (status: string) => {
    if (status === "upcoming") {
      return filteredAppointments.filter(
        (apt) =>
          apt.status === "approved" && new Date(apt.preferredTime) > new Date(),
      );
    }
    return filteredAppointments.filter((apt) => apt.status === status);
  };

  const allAppointments = filteredAppointments;
  const upcomingAppointments = getAppointmentsByStatus("upcoming");
  const pendingAppointments = getAppointmentsByStatus("pending");
  const pastAppointments = filteredAppointments.filter(
    (apt) =>
      (apt.status === "completed" || apt.status === "approved") &&
      new Date(apt.preferredTime) < new Date(),
  );

  const stats = [
    {
      label: "Total",
      count: allAppointments.length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Upcoming",
      count: upcomingAppointments.length,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Pending",
      count: pendingAppointments.length,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Completed",
      count: pastAppointments.length,
      color: "bg-gray-100 text-gray-800",
    },
  ];

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
              My Appointments
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your healthcare appointments
            </p>
          </div>
          <Link to="/book-appointment">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.count}
                </div>
                <Badge className={stat.color}>{stat.label}</Badge>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search appointments..."
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

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({allAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {allAppointments.length > 0 ? (
                allAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No appointments found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "You haven't booked any appointments yet"}
                    </p>
                    <Link to="/book-appointment">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Book Your First Appointment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upcoming appointments
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Schedule your next appointment to maintain your health
                    </p>
                    <Link to="/book-appointment">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
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
                      are waiting for doctor approval. You'll receive a
                      notification once they're reviewed.
                    </p>
                  </div>
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No pending appointments
                    </h3>
                    <p className="text-gray-600">
                      All your appointments have been reviewed
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No past appointments
                    </h3>
                    <p className="text-gray-600">
                      Your appointment history will appear here
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

export default PatientAppointments;
