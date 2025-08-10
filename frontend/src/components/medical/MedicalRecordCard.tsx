import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Stethoscope,
  Pill,
  TestTube,
  Calendar,
  Download,
  Eye,
} from "lucide-react";
import { MedicalRecord } from "@/types";

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return <Pill className="h-4 w-4" />;
      case "visit":
        return <Stethoscope className="h-4 w-4" />;
      case "diagnosis":
        return <FileText className="h-4 w-4" />;
      case "lab-result":
        return <TestTube className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prescription":
        return "bg-green-100 text-green-800";
      case "visit":
        return "bg-blue-100 text-blue-800";
      case "diagnosis":
        return "bg-purple-100 text-purple-800";
      case "lab-result":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-md">
              {getTypeIcon(record.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{record.title}</h3>
              <p className="text-sm text-gray-600">Dr. {record.doctorName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getTypeColor(record.type)}>
              {record.type.replace("-", " ").charAt(0).toUpperCase() +
                record.type.replace("-", " ").slice(1)}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(record.date)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {record.description}
          </p>
        </div>

        {/* Metadata */}
        {record.metadata && Object.keys(record.metadata).length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Additional Information
            </h4>
            <div className="space-y-1">
              {Object.entries(record.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="text-gray-900 font-medium">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {record.attachments && record.attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Attachments
            </h4>
            <div className="space-y-2">
              {record.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <span className="text-sm text-gray-700">{attachment}</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record-specific information */}
        {record.type === "prescription" && (
          <div className="bg-green-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-green-900 mb-1">
              Prescription Details
            </h4>
            <p className="text-sm text-green-800">
              Follow dosage instructions carefully. Contact your doctor if you
              experience any side effects.
            </p>
          </div>
        )}

        {record.type === "lab-result" && (
          <div className="bg-orange-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-orange-900 mb-1">
              Lab Results
            </h4>
            <p className="text-sm text-orange-800">
              Results have been reviewed by your doctor. Follow up as
              recommended.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
