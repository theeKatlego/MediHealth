import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Users,
  Search,
  Filter,
  Calendar,
  MessageCircle,
  FileText,
  Phone,
  Mail,
  Clock,
  Activity,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient, Appointment, MedicalRecord } from "@/types";
import { apiService, mockUsers, mockAppointments } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const DoctorPatients = () => {
  const { state } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!state.user) return;

      try {
        // Get all patients who have appointments with this doctor
        const appointments = await apiService.getAppointments(
          state.user.id,
          "doctor",
        );
        const patientIds = [
          ...new Set(appointments.map((apt) => apt.patientId).filter(Boolean)),
        ];

        // Get patient details
        const allPatients = mockUsers.filter(
          (user) => user.role === "patient",
        ) as Patient[];
        const doctorPatients = allPatients.filter(
          (patient) =>
            patientIds.includes(patient.id) ||
            appointments.some((apt) => apt.patientEmail === patient.email),
        );

        setPatients(doctorPatients);
        setFilteredPatients(doctorPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [state.user]);

  useEffect(() => {
    let filtered = patients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter (based on recent appointments)
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => {
        const recentAppointments = mockAppointments.filter(
          (apt) =>
            apt.patientId === patient.id && apt.doctorId === state.user?.id,
        );

        switch (statusFilter) {
          case "active":
            return recentAppointments.some(
              (apt) =>
                apt.status === "approved" &&
                new Date(apt.preferredTime) > new Date(),
            );
          case "recent":
            return recentAppointments.some(
              (apt) =>
                new Date(apt.createdAt) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            );
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          const aRecentApt = mockAppointments
            .filter((apt) => apt.patientId === a.id)
            .sort(
              (x, y) =>
                new Date(y.createdAt).getTime() -
                new Date(x.createdAt).getTime(),
            )[0];
          const bRecentApt = mockAppointments
            .filter((apt) => apt.patientId === b.id)
            .sort(
              (x, y) =>
                new Date(y.createdAt).getTime() -
                new Date(x.createdAt).getTime(),
            )[0];

          if (!aRecentApt && !bRecentApt) return 0;
          if (!aRecentApt) return 1;
          if (!bRecentApt) return -1;
          return (
            new Date(bRecentApt.createdAt).getTime() -
            new Date(aRecentApt.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchTerm, statusFilter, sortBy, state.user]);

  const getPatientStats = (patient: Patient) => {
    const patientAppointments = mockAppointments.filter(
      (apt) => apt.patientId === patient.id && apt.doctorId === state.user?.id,
    );

    return {
      totalAppointments: patientAppointments.length,
      completedAppointments: patientAppointments.filter(
        (apt) => apt.status === "completed",
      ).length,
      lastVisit: patientAppointments
        .filter((apt) => apt.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.preferredTime).getTime() -
            new Date(a.preferredTime).getTime(),
        )[0]?.preferredTime,
      nextAppointment: patientAppointments
        .filter(
          (apt) =>
            apt.status === "approved" &&
            new Date(apt.preferredTime) > new Date(),
        )
        .sort(
          (a, b) =>
            new Date(a.preferredTime).getTime() -
            new Date(b.preferredTime).getTime(),
        )[0]?.preferredTime,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const overallStats = {
    totalPatients: patients.length,
    activePatients: patients.filter((patient) => {
      const stats = getPatientStats(patient);
      return (
        stats.nextAppointment ||
        (stats.lastVisit &&
          new Date(stats.lastVisit) >
            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      );
    }).length,
    newThisMonth: patients.filter((patient) => {
      const stats = getPatientStats(patient);
      return (
        stats.totalAppointments === 1 &&
        stats.lastVisit &&
        new Date(stats.lastVisit) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    }).length,
    totalConsultations: mockAppointments.filter(
      (apt) => apt.doctorId === state.user?.id && apt.status === "completed",
    ).length,
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
            <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
            <p className="text-gray-600 mt-1">
              Manage and communicate with your patients
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {overallStats.totalPatients}
              </div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {overallStats.activePatients}
              </div>
              <div className="text-sm text-gray-600">Active Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {overallStats.newThisMonth}
              </div>
              <div className="text-sm text-gray-600">New This Month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {overallStats.totalConsultations}
              </div>
              <div className="text-sm text-gray-600">Total Consultations</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Patients
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
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="active">Active Patients</SelectItem>
                  <SelectItem value="recent">Recent Patients</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("name");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => {
              const stats = getPatientStats(patient);
              return (
                <Card
                  key={patient.id}
                  className="hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-500 text-white">
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {patient.email}
                        </p>
                        {patient.phone && (
                          <p className="text-sm text-gray-600">
                            {patient.phone}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Patient
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Patient Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-600">
                          {stats.totalAppointments}
                        </div>
                        <div className="text-blue-800 text-xs">
                          Total Visits
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-600">
                          {stats.completedAppointments}
                        </div>
                        <div className="text-green-800 text-xs">Completed</div>
                      </div>
                    </div>

                    {/* Last Visit */}
                    {stats.lastVisit && (
                      <div className="text-sm">
                        <span className="text-gray-600">Last visit: </span>
                        <span className="font-medium">
                          {new Date(stats.lastVisit).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Next Appointment */}
                    {stats.nextAppointment && (
                      <div className="text-sm">
                        <span className="text-gray-600">
                          Next appointment:{" "}
                        </span>
                        <span className="font-medium text-blue-600">
                          {new Date(stats.nextAppointment).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Link
                        to={`/chat?patientId=${patient.id}`}
                        className="flex-1"
                      >
                        <Button size="sm" variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No patients found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any patients yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Patient Care Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <Heart className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">Regular Follow-ups</p>
                  <p className="text-blue-700">
                    Schedule follow-up appointments for better patient outcomes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MessageCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">Stay Connected</p>
                  <p className="text-blue-700">
                    Use chat to answer patient questions promptly
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">Update Records</p>
                  <p className="text-blue-700">
                    Keep patient medical records up to date
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default DoctorPatients;
