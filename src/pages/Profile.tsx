import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  GraduationCap,
  DollarSign,
  Clock,
  Save,
  Edit2,
  Shield,
} from "lucide-react";
import { Doctor, Patient } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { toast } from "sonner";

const Profile = () => {
  const { state, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    phone: state.user?.phone || "",
    dateOfBirth: (state.user as Patient)?.dateOfBirth || "",
    address: state.user?.address || "",
    // Doctor-specific fields
    specialization: (state.user as Doctor)?.specialization || "",
    qualifications: (state.user as Doctor)?.qualifications?.join(", ") || "",
    experience: (state.user as Doctor)?.experience?.toString() || "",
    consultationFee: (state.user as Doctor)?.consultationFee?.toString() || "",
    // Patient-specific fields
    emergencyContactName: (state.user as Patient)?.emergencyContact?.name || "",
    emergencyContactPhone:
      (state.user as Patient)?.emergencyContact?.phone || "",
    emergencyContactRelationship:
      (state.user as Patient)?.emergencyContact?.relationship || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!state.user) return;

    setIsLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      if (state.user.role === "doctor") {
        updateData.specialization = formData.specialization;
        updateData.qualifications = formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean);
        updateData.experience = parseInt(formData.experience) || 0;
        updateData.consultationFee = parseFloat(formData.consultationFee) || 0;
      } else if (state.user.role === "patient") {
        updateData.dateOfBirth = formData.dateOfBirth;
        updateData.emergencyContact = {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        };
      }

      const updatedUser = await apiService.updateUserProfile(
        state.user.id,
        updateData,
      );
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!state.user) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="text-center">
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  const isDoctor = state.user.role === "doctor";
  const isPatient = state.user.role === "patient";

  return (
    <Sidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {getInitials(state.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {state.user.name}
                  </h2>
                  <Badge className={getRoleColor(state.user.role)}>
                    {state.user.role.charAt(0).toUpperCase() +
                      state.user.role.slice(1)}
                  </Badge>
                </div>
                <div className="text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {state.user.email}
                  </div>
                  {state.user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {state.user.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since{" "}
                    {new Date(state.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {state.user.name}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {state.user.email}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {state.user.phone || "Not provided"}
                  </div>
                )}
              </div>

              {isPatient && (
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Patient).dateOfBirth
                        ? new Date(
                            (state.user as Patient).dateOfBirth!,
                          ).toLocaleDateString()
                        : "Not provided"}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your address"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded min-h-[80px]">
                  {state.user.address || "Not provided"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctor-specific Information */}
        {isDoctor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  {isEditing ? (
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) =>
                        handleInputChange("specialization", e.target.value)
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Doctor).specialization}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Doctor).experience} years
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                  {isEditing ? (
                    <Input
                      id="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) =>
                        handleInputChange("consultationFee", e.target.value)
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      ${(state.user as Doctor).consultationFee}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="qualifications">
                  Qualifications (comma-separated)
                </Label>
                {isEditing ? (
                  <Textarea
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={(e) =>
                      handleInputChange("qualifications", e.target.value)
                    }
                    placeholder="e.g., MD Cardiology, FACC, Board Certified"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="flex flex-wrap gap-2">
                      {(state.user as Doctor).qualifications?.map(
                        (qual, index) => (
                          <Badge key={index} variant="outline">
                            {qual}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Stats */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(state.user as Doctor).rating}/5.0
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(state.user as Doctor).totalPatients}
                  </div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(state.user as Doctor).availability.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </div>
                  <div className="text-sm text-gray-600">Current Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient-specific Information */}
        {isPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) =>
                        handleInputChange(
                          "emergencyContactName",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Patient).emergencyContact?.name ||
                        "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) =>
                        handleInputChange(
                          "emergencyContactPhone",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Patient).emergencyContact?.phone ||
                        "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactRelationship">
                    Relationship
                  </Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) =>
                        handleInputChange(
                          "emergencyContactRelationship",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {(state.user as Patient).emergencyContact?.relationship ||
                        "Not provided"}
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Summary */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(state.user as Patient).medicalHistory?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Medical Records</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Active</div>
                  <div className="text-sm text-gray-600">Patient Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-600">
                    Last updated 3 months ago
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Login Sessions</h3>
                  <p className="text-sm text-gray-600">
                    Manage your active sessions
                  </p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default Profile;
