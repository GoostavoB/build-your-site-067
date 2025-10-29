import { motion } from "framer-motion";
import { Camera, DollarSign, CheckSquare, TrendingUp, Calculator, FileText, Receipt, Globe, Target, Brain, BarChart3, Shield, BookOpen, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

const FeatureBlocks = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Camera,
      title: t('landing.features.aiUpload', 'AI upload from screenshots'),
      description: t('landing.features.aiUploadDesc', 'Upload trade screenshots and let AI extract all data automatically.'),
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: DollarSign,
      title: t('landing.features.feesDashboard', 'Fees dashboard'),
      description: t('landing.features.feesDashboardDesc', 'Track broker and exchange costs to optimize your trading.'),
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: CheckSquare,
      title: t('landing.features.preTradeChecklist', 'Pre-trade checklist'),
      description: t('landing.features.preTradeChecklistDesc', 'Ensure discipline with systematic pre-trade validation.'),
      gradient: "from-green-500/20 to-green-500/5"
    },
    {
      icon: TrendingUp,
      title: t('landing.features.weeklyHeatmap', 'Weekly heat map'),
      description: t('landing.features.weeklyHeatmapDesc', 'Identify your best trading times and assets.'),
      gradient: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: Calculator,
      title: t('landing.features.leverageCalculator', 'Leverage calculator'),
      description: t('landing.features.leverageCalculatorDesc', 'Calculate position size based on risk and stop loss.'),
      gradient: "from-orange-500/20 to-orange-500/5"
    },
    {
      icon: FileText,
      title: t('landing.features.csvExport', 'CSV export'),
      description: t('landing.features.csvExportDesc', 'Export your trading data for external analysis.'),
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Receipt,
      title: t('landing.features.taxReport', 'Tax report'),
      description: t('landing.features.taxReportDesc', 'Generate comprehensive tax reports for all trades.'),
      gradient: "from-red-500/20 to-red-500/5"
    },
    {
      icon: Globe,
      title: t('landing.features.consolidatedResults', 'Consolidated results'),
      description: t('landing.features.consolidatedResultsDesc', 'See all exchange performance in one place.'),
      gradient: "from-cyan-500/20 to-cyan-500/5"
    },
    {
      icon: Target,
      title: t('landing.features.goalPlanner', 'Goal planner'),
      description: t('landing.features.goalPlannerDesc', 'Set and track your trading objectives.'),
      gradient: "from-pink-500/20 to-pink-500/5"
    },
    {
      icon: Brain,
      title: t('landing.features.psychology', 'Psychology tools'),
      description: t('landing.features.psychologyDesc', 'Track emotions and improve decision-making.'),
      gradient: "from-indigo-500/20 to-indigo-500/5"
    },
    {
      icon: BarChart3,
      title: t('landing.features.riskManagement', 'Risk management'),
      description: t('landing.features.riskManagementDesc', 'Monitor and control your trading risk exposure.'),
      gradient: "from-yellow-500/20 to-yellow-500/5"
    },
    {
      icon: BookOpen,
      title: t('landing.features.tradingJournal', 'Trading journal'),
      description: t('landing.features.tradingJournalDesc', 'Document and review every trading decision.'),
      gradient: "from-teal-500/20 to-teal-500/5"
    },
    {
      icon: Wallet,
      title: t('landing.features.spotWallet', 'Spot wallet tracking'),
      description: t('landing.features.spotWalletDesc', 'Track your spot holdings across exchanges.'),
      gradient: "from-emerald-500/20 to-emerald-500/5"
    }
  ];

  return (
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('landing.features.sectionTitle', 'Features That Drive Results')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('landing.features.sectionSubtitle', 'Everything you need to improve your trading performance')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`p-6 glass-strong border-primary/20 bg-gradient-to-br ${feature.gradient}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-xl font-semibold mt-12"
        >
          {t('landing.features.bottomLine', 'All in one platform for professional crypto traders.')}
        </motion.p>
      </div>
    </section>
  );
};

export default FeatureBlocks;
