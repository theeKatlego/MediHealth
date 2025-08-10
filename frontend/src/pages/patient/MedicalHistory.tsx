import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/Sidebar";
import { MedicalRecordCard } from "@/components/medical/MedicalRecordCard";
import { FileText, Filter, Search, Download, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalRecord } from "@/types";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const MedicalHistory = () => {
  const { state } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!state.user) return;

      try {
        const recordsData = await apiService.getPatientMedicalHistory(
          state.user.id,
        );
        setRecords(recordsData);
        setFilteredRecords(recordsData);
      } catch (error) {
        console.error("Failed to fetch medical history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [state.user]);

  useEffect(() => {
    let filtered = records;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "doctor":
          return a.doctorName.localeCompare(b.doctorName);
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  }, [records, searchTerm, typeFilter, sortBy]);

  const getRecordsByType = (type: string) => {
    return filteredRecords.filter((record) => record.type === type);
  };

  const prescriptions = getRecordsByType("prescription");
  const visits = getRecordsByType("visit");
  const diagnoses = getRecordsByType("diagnosis");
  const labResults = getRecordsByType("lab-result");

  const stats = [
    {
      label: "Total Records",
      count: filteredRecords.length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Prescriptions",
      count: prescriptions.length,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Visits",
      count: visits.length,
      color: "bg-purple-100 text-purple-800",
    },
    {
      label: "Lab Results",
      count: labResults.length,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const handleExportRecords = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "medical-history.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
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
              Medical History
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your medical records
            </p>
          </div>
          <Button onClick={handleExportRecords} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
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
              Filter Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prescription">Prescriptions</SelectItem>
                  <SelectItem value="visit">Visits</SelectItem>
                  <SelectItem value="diagnosis">Diagnoses</SelectItem>
                  <SelectItem value="lab-result">Lab Results</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="doctor">Doctor Name</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setSortBy("date-desc");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({filteredRecords.length})
            </TabsTrigger>
            <TabsTrigger value="prescription">
              Prescriptions ({prescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="visit">Visits ({visits.length})</TabsTrigger>
            <TabsTrigger value="diagnosis">
              Diagnoses ({diagnoses.length})
            </TabsTrigger>
            <TabsTrigger value="lab-result">
              Lab Results ({labResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredRecords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecords.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No medical records found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || typeFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Your medical history will appear here after consultations"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prescription">
            <div className="space-y-4">
              {prescriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No prescriptions found
                    </h3>
                    <p className="text-gray-600">
                      Your prescription history will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="visit">
            <div className="space-y-4">
              {visits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visits.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No visit records found
                    </h3>
                    <p className="text-gray-600">
                      Your visit history will appear here after appointments
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="diagnosis">
            <div className="space-y-4">
              {diagnoses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnoses.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No diagnoses found
                    </h3>
                    <p className="text-gray-600">
                      Diagnosis records from your consultations will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lab-result">
            <div className="space-y-4">
              {labResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {labResults.map((record) => (
                    <MedicalRecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No lab results found
                    </h3>
                    <p className="text-gray-600">
                      Your lab test results will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity Summary */}
        {filteredRecords.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Last Visit:</span>
                  <span className="ml-2 text-blue-800">
                    {visits.length > 0
                      ? new Date(visits[0].date).toLocaleDateString()
                      : "No visits recorded"}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">
                    Active Prescriptions:
                  </span>
                  <span className="ml-2 text-blue-800">
                    {prescriptions.length}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">
                    Total Records:
                  </span>
                  <span className="ml-2 text-blue-800">{records.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Sidebar>
  );
};

export default MedicalHistory;
