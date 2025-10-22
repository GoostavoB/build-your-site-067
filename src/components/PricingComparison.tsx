import React from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const PricingComparison = () => {
  const { t } = useTranslation();

  const features = [
    {
      category: t('pricing.comparison.categories.aiAnalytics'),
      items: [
        { name: t('pricing.comparison.features.aiUploads'), basic: "50/mo", pro: "100/mo", elite: "300/mo" },
        { name: t('pricing.comparison.features.manualUploads'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.aiAnalysis'), basic: false, pro: "1/week", elite: "5/week" },
        { name: t('pricing.comparison.features.customWidgets'), basic: "15+", pro: t('pricing.comparison.unlimited'), elite: t('pricing.comparison.unlimited') },
        { name: t('pricing.comparison.features.advancedCharts'), basic: true, pro: true, elite: true },
      ]
    },
    {
      category: t('pricing.comparison.categories.tradingTools'),
      items: [
        { name: t('pricing.comparison.features.tradingPlan'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.preTradeChecklist'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.goalsTracking'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.tradeReplay'), basic: false, pro: false, elite: true },
        { name: t('pricing.comparison.features.positionCalculator'), basic: false, pro: false, elite: true },
      ]
    },
    {
      category: t('pricing.comparison.categories.journaling'),
      items: [
        { name: t('pricing.comparison.features.basicJournal'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.emotionalTimeline'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.richJournal'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.patternAnalysis'), basic: false, pro: true, elite: true },
      ]
    },
    {
      category: t('pricing.comparison.categories.riskManagement'),
      items: [
        { name: t('pricing.comparison.features.feeAnalytics'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.riskDashboard'), basic: false, pro: false, elite: true },
        { name: t('pricing.comparison.features.drawdownAnalysis'), basic: false, pro: false, elite: true },
        { name: t('pricing.comparison.features.performanceAlerts'), basic: false, pro: false, elite: true },
      ]
    },
    {
      category: t('pricing.comparison.categories.integrations'),
      items: [
        { name: t('pricing.comparison.features.csvImport'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.exchangeConnections'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.autoRefresh'), basic: false, pro: true, elite: true },
      ]
    },
    {
      category: t('pricing.comparison.categories.social'),
      items: [
        { name: t('pricing.comparison.features.viewFeed'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.createPosts'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.leaderboard'), basic: true, pro: true, elite: true },
        { name: t('pricing.comparison.features.xpBadges'), basic: false, pro: true, elite: true },
        { name: t('pricing.comparison.features.challenges'), basic: false, pro: true, elite: true },
      ]
    },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('pricing.comparison.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('pricing.comparison.subtitle')}
          </p>
        </div>

        {/* Guarantee Banner */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              {t('pricing.guaranteeNote')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-card rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="border-b-2 bg-muted/50">
                <th className="text-left p-5 font-bold text-base">{t('pricing.comparison.feature')}</th>
                <th className="text-center p-5 font-bold text-base">Basic</th>
                <th className="text-center p-5 font-bold text-base bg-primary/10 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                  Pro
                </th>
                <th className="text-center p-5 font-bold text-base">Elite</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIdx) => (
                <React.Fragment key={categoryIdx}>
                  <tr className="bg-muted/40">
                    <td colSpan={4} className="p-4 font-bold text-sm uppercase tracking-wider text-primary">
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item, itemIdx) => (
                    <tr 
                      key={itemIdx} 
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-all duration-200 group"
                    >
                      <td className="p-5 font-medium">{item.name}</td>
                      <td className="p-5 text-center group-hover:scale-105 transition-transform">{renderCell(item.basic)}</td>
                      <td className="p-5 text-center bg-primary/5 group-hover:bg-primary/10 group-hover:scale-105 transition-all">{renderCell(item.pro)}</td>
                      <td className="p-5 text-center group-hover:scale-105 transition-transform">{renderCell(item.elite)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
