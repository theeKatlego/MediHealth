import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  History,
  MessageCircle,
  User,
  Clock,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  roles: string[];
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ["patient"],
  },
  {
    label: "Dashboard",
    href: "/doctor/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ["doctor"],
  },
  {
    label: "Appointments",
    href: "/patient/appointments",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["patient"],
  },
  {
    label: "Appointments",
    href: "/doctor/appointments",
    icon: <Calendar className="h-4 w-4" />,
    badge: "3",
    roles: ["doctor"],
  },
  {
    label: "Medical History",
    href: "/patient/medical-history",
    icon: <History className="h-4 w-4" />,
    roles: ["patient"],
  },
  {
    label: "Schedule",
    href: "/doctor/schedule",
    icon: <Clock className="h-4 w-4" />,
    roles: ["doctor"],
  },
  {
    label: "Availability",
    href: "/doctor/availability",
    icon: <Stethoscope className="h-4 w-4" />,
    roles: ["doctor"],
  },
  {
    label: "Patients",
    href: "/doctor/patients",
    icon: <Users className="h-4 w-4" />,
    roles: ["doctor"],
  },
  {
    label: "Chat",
    href: "/chat",
    icon: <MessageCircle className="h-4 w-4" />,
    badge: "2",
    roles: ["patient", "doctor"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
    roles: ["patient", "doctor"],
  },
];

export function Sidebar({ children }: SidebarProps) {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.isAuthenticated || !state.user) {
    return <>{children}</>;
  }

  const userRole = state.user.role;
  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {userRole === "doctor" ? "Doctor Portal" : "Patient Portal"}
            </h2>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      isActive
                        ? "bg-blue-50 border-blue-500 text-blue-700 border-r-2"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    )}
                  >
                    <div className="mr-3 flex-shrink-0">{item.icon}</div>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info at bottom */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {state.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {state.user.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
