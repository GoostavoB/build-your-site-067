import AppLayout from '@/components/layout/AppLayout';
import { TradingJournal } from '@/components/TradingJournal';
import { RiskCalculator } from '@/components/RiskCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calculator } from 'lucide-react';

const Tools = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Trading Tools</h1>
          <p className="text-muted-foreground">
            Journal your trades and calculate risk metrics
          </p>
        </div>

        <Tabs defaultValue="journal" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="journal" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Risk Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal">
            <TradingJournal />
          </TabsContent>

          <TabsContent value="calculator">
            <RiskCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Tools;
