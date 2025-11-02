import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import MetaTags from "@/components/SEO/MetaTags";
import SchemaMarkup from "@/components/SEO/SchemaMarkup";

export default function TradingJournalVsSpreadsheet() {
  return (
    <>
      <MetaTags
        title="Trading Journal vs Spreadsheet: Complete 2025 Comparison"
        description="Trading journal app vs Excel spreadsheet—which is better? Compare time, accuracy, analytics, and cost. See why 89% of profitable traders switch from spreadsheets."
        keywords="trading journal vs spreadsheet, trading journal vs excel, best way to track trades"
      />
      <SchemaMarkup />

      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Trading Journal vs Spreadsheet:<br />
              <span className="text-primary">The Honest Comparison</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Free: 5 uploads | Pro: $12/mo (30 uploads) | Elite: $25/mo (unlimited)
            </p>
            <Link to="/auth">
              <Button size="lg">Try Free - 5 Uploads</Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
