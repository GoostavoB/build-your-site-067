import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  name: string;
  type: string;
  format: string;
  dateGenerated: Date;
  dateRange: {
    start: Date;
    end: Date;
  };
  size: string;
}

export function ReportHistory() {
  // Mock data - in production this would come from the database
  const reports: Report[] = [
    {
      id: "1",
      name: "Monthly Performance Report",
      type: "monthly",
      format: "pdf",
      dateGenerated: new Date("2024-01-15"),
      dateRange: {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-31"),
      },
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Q4 2023 Summary",
      type: "quarterly",
      format: "excel",
      dateGenerated: new Date("2024-01-05"),
      dateRange: {
        start: new Date("2023-10-01"),
        end: new Date("2023-12-31"),
      },
      size: "1.8 MB",
    },
    {
      id: "3",
      name: "Year End Report 2023",
      type: "yearly",
      format: "pdf",
      dateGenerated: new Date("2024-01-02"),
      dateRange: {
        start: new Date("2023-01-01"),
        end: new Date("2023-12-31"),
      },
      size: "5.2 MB",
    },
  ];

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case "pdf":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "excel":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "json":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "quarterly":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "yearly":
        return "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report History</CardTitle>
        <CardDescription>Previously generated trading reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{report.name}</h4>
                    <Badge className={getTypeBadgeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <Badge className={getFormatBadgeColor(report.format)}>
                      {report.format.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(report.dateRange.start, "MMM d")} - {format(report.dateRange.end, "MMM d, yyyy")}
                    </div>
                    <span>Generated: {format(report.dateGenerated, "MMM d, yyyy")}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
              <p className="text-sm text-muted-foreground">
                Generate your first report to see it here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
