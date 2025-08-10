import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/appointments/DoctorCard";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Doctor } from "@/types";
import { apiService } from "@/services/api";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await apiService.getDoctors();
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.qualifications.some((qual) =>
            qual.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Specialization filter
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(
        (doctor) =>
          doctor.specialization.toLowerCase() ===
          selectedSpecialization.toLowerCase(),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return b.experience - a.experience;
        case "patients":
          return b.totalPatients - a.totalPatients;
        case "fee-low":
          return a.consultationFee - b.consultationFee;
        case "fee-high":
          return b.consultationFee - a.consultationFee;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialization, sortBy]);

  const specializations = Array.from(
    new Set(doctors.map((doctor) => doctor.specialization)),
  );

  const stats = {
    totalDoctors: doctors.length,
    availableToday: doctors.filter((d) => {
      const today = new Date()
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase();
      return (
        d.availability.isAvailable &&
        d.availability.schedule[today]?.isAvailable
      );
    }).length,
    avgRating:
      doctors.length > 0
        ? (
            doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length
          ).toFixed(1)
        : "0",
    specializations: specializations.length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
          <p className="text-gray-600 mt-2">
            Browse our network of qualified healthcare professionals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalDoctors}
              </div>
              <div className="text-sm text-gray-600">Total Doctors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.availableToday}
              </div>
              <div className="text-sm text-gray-600">Available Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                <Star className="h-5 w-5 mr-1" />
                {stats.avgRating}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.specializations}
              </div>
              <div className="text-sm text-gray-600">Specializations</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search doctors, specializations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Specialization Filter */}
              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="patients">Most Patients</SelectItem>
                  <SelectItem value="fee-low">Lowest Fee</SelectItem>
                  <SelectItem value="fee-high">Highest Fee</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("all");
                  setSortBy("rating");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} of {doctors.length} doctors
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSpecialization !== "all" &&
              ` in ${selectedSpecialization}`}
          </p>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 text-lg mb-2">No doctors found</div>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can't find the right doctor?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact our support team to help you find the perfect healthcare
                provider
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    // Open contact support dialog
                    const email = "support@medihealth.com";
                    const subject = "Help Finding a Doctor";
                    const body =
                      "Hello MediHealth Support Team,\n\nI need assistance finding the right healthcare provider. Please help me with:\n\n- Specific medical condition or specialty needed\n- Preferred location\n- Insurance requirements\n- Any other preferences\n\nThank you for your assistance.\n\nBest regards";
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Show request doctor form/modal
                    const doctorName = prompt(
                      "What type of doctor or specialist are you looking for?",
                    );
                    if (doctorName) {
                      const email = "requests@medihealth.com";
                      const subject = "Doctor Request";
                      const body = `Hello MediHealth Team,\n\nI would like to request that you add the following type of healthcare provider to your platform:\n\nSpecialty/Type: ${doctorName}\n\nAdditional requirements:\n- Location preference: \n- Specific qualifications needed: \n- Urgency level: \n- Other notes: \n\nPlease let me know if this type of provider can be added to your network.\n\nThank you!`;
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }
                  }}
                >
                  Request Doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
