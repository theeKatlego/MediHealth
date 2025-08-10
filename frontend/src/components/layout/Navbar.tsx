import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, X, Heart, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getDashboardPath = () => {
    if (!state.user) return "/";
    return state.user.role === "doctor"
      ? "/doctor/dashboard"
      : "/patient/dashboard";
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

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                MediHealth
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!state.isAuthenticated ? (
              <>
                <Link to="/doctors">
                  <Button variant="ghost">Find Doctors</Button>
                </Link>
                <Link to="/book-appointment">
                  <Button variant="ghost">Book Appointment</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardPath()}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>

                {state.user?.role === "patient" && (
                  <>
                    <Link to="/patient/appointments">
                      <Button variant="ghost">Appointments</Button>
                    </Link>
                    <Link to="/patient/medical-history">
                      <Button variant="ghost">Medical History</Button>
                    </Link>
                  </>
                )}

                {state.user?.role === "doctor" && (
                  <>
                    <Link to="/doctor/appointments">
                      <Button variant="ghost">Appointments</Button>
                    </Link>
                    <Link to="/doctor/schedule">
                      <Button variant="ghost">Schedule</Button>
                    </Link>
                  </>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {state.user ? getInitials(state.user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {state.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {state.user?.email}
                        </p>
                        <Badge
                          className={`w-fit text-xs ${getRoleColor(state.user?.role || "")}`}
                        >
                          {state.user?.role?.charAt(0).toUpperCase() +
                            state.user?.role?.slice(1)}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {!state.isAuthenticated ? (
              <>
                <Link
                  to="/doctors"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Find Doctors
                </Link>
                <Link
                  to="/book-appointment"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Appointment
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2 border-b">
                  <div className="text-base font-medium text-gray-800">
                    {state.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {state.user?.email}
                  </div>
                  <Badge
                    className={`mt-1 text-xs ${getRoleColor(state.user?.role || "")}`}
                  >
                    {state.user?.role?.charAt(0).toUpperCase() +
                      state.user?.role?.slice(1)}
                  </Badge>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
