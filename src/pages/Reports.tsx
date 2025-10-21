import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportHistory } from "@/components/reports/ReportHistory";
import { ScheduledReports } from "@/components/reports/ScheduledReports";
import { FileText, History, Clock, FileBarChart } from "lucide-react";

export default function Reports() {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <FileBarChart className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Reports & Export</h1>
            <p className="text-muted-foreground">Generate comprehensive trading performance reports</p>
          </div>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="gap-2">
              <FileText className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <Clock className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="history">
            <ReportHistory />
          </TabsContent>

          <TabsContent value="scheduled">
            <ScheduledReports />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
