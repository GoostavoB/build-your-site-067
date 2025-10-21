import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Plus, Trash2 } from "lucide-react";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  format: "pdf" | "excel";
  email: boolean;
  enabled: boolean;
  nextRun: Date;
}

export function ScheduledReports() {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Weekly Performance Summary",
      frequency: "weekly",
      format: "pdf",
      email: true,
      enabled: true,
      nextRun: new Date("2024-01-22"),
    },
    {
      id: "2",
      name: "Monthly Trading Report",
      frequency: "monthly",
      format: "excel",
      email: true,
      enabled: true,
      nextRun: new Date("2024-02-01"),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-blue-500/10 text-blue-500";
      case "weekly":
        return "bg-green-500/10 text-green-500";
      case "monthly":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>Automate report generation and delivery</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Report Name</Label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Weekly Summary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Email Delivery</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="email-schedule" />
                    <Label htmlFor="email-schedule" className="cursor-pointer">
                      Send via email
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">Save Schedule</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={() => toggleSchedule(schedule.id)}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{schedule.name}</h4>
                    <Badge className={getFrequencyColor(schedule.frequency)}>
                      {schedule.frequency}
                    </Badge>
                    <Badge variant="outline">{schedule.format.toUpperCase()}</Badge>
                    {schedule.email && (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Next run: {schedule.nextRun.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSchedule(schedule.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          {schedules.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Reports</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create automated reports to save time
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Schedule
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
