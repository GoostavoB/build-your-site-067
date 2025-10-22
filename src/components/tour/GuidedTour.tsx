import { useEffect, useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from 'react-joyride';
import { useGuidedTour, TourMode } from '@/hooks/useGuidedTour';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const fullTourSteps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-light tracking-wide">Bem-vindo ao Tour Guiado</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vamos apresentar todas as funcionalidades da plataforma para você aproveitar ao máximo.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard-customization"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Personalize seu Dashboard</h3>
        <p className="text-sm leading-relaxed text-center">
          Reorganize widgets, adicione novos gráficos e crie uma visualização perfeita para o seu estilo de trading.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="theme-toggle"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Modo Claro/Escuro e Mudança de Cores</h3>
        <p className="text-sm leading-relaxed text-center">
          Alterne entre tema claro e escuro, personalize as cores da interface e ajuste o contraste para uma experiência visual perfeita. Escolha entre diversos esquemas de cores e encontre o visual ideal para o seu momento de trading.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="portfolio-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Portfólio</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Gerencie seus ativos e contas:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Spot Wallet</span> — Visualize saldo total, distribuição de tokens e alocação de ativos</p>
            <p><span className="font-medium">Exchanges</span> — Conecte APIs da Binance, Bybit, OKX para sincronização automática</p>
            <p><span className="font-medium">Trading Accounts</span> — Gerencie múltiplas contas e acompanhe capital inicial por conta</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="trades-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Operações</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Registre e analise suas operações:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Adicionar Trade</span> — Importe CSVs ou adicione operações manualmente</p>
            <p><span className="font-medium">Trade Analysis</span> — Análise detalhada de performance, win rate e padrões de trading</p>
            <p><span className="font-medium">Fee Analysis</span> — Acompanhe custos, taxas e otimize eficiência operacional</p>
            <p><span className="font-medium">Risk Management</span> — Calculadora de position size, controle de drawdown e limites</p>
            <p><span className="font-medium">Trading Journal</span> — Registre observações, lições aprendidas e insights de cada operação</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="analytics-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Análises</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Dados e insights em tempo real:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Market Data</span> — Dados em tempo real de criptomoedas e métricas de mercado</p>
            <p><span className="font-medium">Forecast</span> — Projeções e simulações baseadas em IA para planejar metas</p>
            <p><span className="font-medium">Economic Calendar</span> — Eventos macroeconômicos e impactos no mercado crypto</p>
            <p><span className="font-medium">Performance Alerts</span> — Notificações automáticas sobre métricas e thresholds</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="planning-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Planejamento</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Estruture sua estratégia de trading:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Trading Plan</span> — Defina regras, estratégias e checklists de entrada/saída</p>
            <p><span className="font-medium">Goals</span> — Estabeleça objetivos, acompanhe progresso e celebre conquistas</p>
            <p><span className="font-medium">Psychology</span> — Monitore estado emocional, identifique padrões psicológicos e melhore disciplina</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="reports-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Relatórios</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Documentação e análise de performance:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Reports</span> — Gere relatórios mensais, semanais ou personalizados automaticamente</p>
            <p><span className="font-medium">Tax Reports</span> — Documentação fiscal, cálculo de ganhos de capital e conformidade</p>
            <p><span className="font-medium">My Metrics</span> — Crie KPIs personalizados e benchmarks específicos para seu estilo</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="community-group"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Comunidade</h3>
        <div className="space-y-2 text-sm">
          <p className="text-center mb-3 text-muted-foreground">Conecte-se e evolua com outros traders:</p>
          <div className="space-y-1.5">
            <p><span className="font-medium">Social</span> — Feed social para compartilhar estratégias e resultados</p>
            <p><span className="font-medium">Leaderboard</span> — Rankings de performance entre traders da plataforma</p>
            <p><span className="font-medium">Achievements</span> — Badges, conquistas e sistema de gamificação</p>
            <p><span className="font-medium">Progress XP</span> — Sistema de níveis, experiência e recompensas por consistência</p>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="user-guide"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Guia do Usuário</h3>
        <p className="text-sm leading-relaxed text-center">
          Acesse tutoriais completos, documentação e dicas de uso da plataforma. Aprenda sobre cada funcionalidade através de guias passo a passo, vídeos explicativos e melhores práticas de uso. Sempre disponível para consulta rápida.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="market-data-widget"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Market Data</h3>
        <p className="text-sm leading-relaxed text-center">
          Acompanhe dados de mercado em tempo real: Long/Short Ratio mostra o sentimento institucional, Live Prices traz cotações atualizadas de BTC, ETH e principais altcoins, Open Interest indica volume de contratos futuros, e Fear & Greed Index revela o sentimento geral do mercado.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="live-prices"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Live Prices - Personalize Seus Ativos</h3>
        <p className="text-sm leading-relaxed text-center">
          Visualize cotações em tempo real das suas criptomoedas favoritas. Clique para adicionar ou remover ativos da sua watchlist, reordene conforme sua preferência e acompanhe variações percentuais, volume 24h e capitalização de mercado de forma instantânea.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="settings-capital"]',
    content: (
      <div className="space-y-3">
        <h3 className="font-light text-lg tracking-wide text-center">Configure seu Capital Inicial</h3>
        <p className="text-sm leading-relaxed text-center">
          Defina o valor do seu capital inicial para cálculos precisos de ROI e desempenho. Este valor pode ser editado a qualquer momento. Ao adicionar mais capital, o sistema calculará automaticamente a média ponderada considerando as datas de depósito, garantindo métricas sempre atualizadas e proporcionais ao seu investimento real.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: 'body',
    content: (
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-light tracking-wide">Pronto para começar</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Você agora conhece todas as principais funcionalidades da plataforma.<br />
          Explore e leve seu trading para o próximo nível.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-6 pt-4 border-t border-border/50">
          Você pode rever este tour a qualquer momento nas configurações.
        </p>
      </div>
    ),
    placement: 'center',
  },
];

export const GuidedTour = () => {
  const { shouldShowTour, tourMode, completeTour } = useGuidedTour();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);

  useEffect(() => {
    console.log('🎯 GuidedTour useEffect triggered:', { shouldShowTour, tourMode, isLoadingSteps });
    
    if (shouldShowTour && !isLoadingSteps) {
      console.log('✅ Starting tour load...');
      setIsLoadingSteps(true);
      const cleanup = loadTourSteps();
      return () => {
        if (cleanup) cleanup();
      };
    } else if (!shouldShowTour) {
      console.log('❌ Tour should not show, resetting run state');
      setRun(false);
      setIsLoadingSteps(false);
    }
  }, [shouldShowTour, tourMode]);

  const loadTourSteps = () => {
    console.log('🔄 Loading tour steps for mode:', tourMode);
    let isCancelled = false;
    
    const load = async () => {
      try {
        // Load tour steps based on mode
        if (tourMode === 'full' || tourMode === 'manual-full') {
          console.log('📋 Setting full tour steps');
          if (!isCancelled) {
            setSteps(fullTourSteps);
          }
          
          // Get latest full tour version
          const { data } = await supabase
            .from('tour_versions')
            .select('version')
            .eq('type', 'full')
            .eq('active', true)
            .order('version', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (!isCancelled) {
            setCurrentVersion(data?.version || 1);
          }
        } else if (tourMode === 'updates' || tourMode === 'manual-updates') {
          // Load update-specific steps
          const { data } = await supabase
            .from('tour_versions')
            .select('version, steps')
            .eq('type', 'update')
            .eq('active', true)
            .order('version', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!isCancelled) {
            if (data && data.steps && Array.isArray(data.steps)) {
              setSteps(data.steps as unknown as Step[]);
              setCurrentVersion(data.version);
            } else {
              setSteps(fullTourSteps);
            }
          }
        }

        // Small delay to ensure DOM is fully rendered
        const timer = setTimeout(() => {
          if (!isCancelled) {
            console.log('▶️ Starting tour run');
            setRun(true);
            setIsLoadingSteps(false);
          }
        }, 800);
        
        return () => {
          clearTimeout(timer);
          isCancelled = true;
        };
      } catch (error) {
        console.error('Error loading tour steps:', error);
        if (!isCancelled) {
          setSteps(fullTourSteps);
          setRun(true);
          setIsLoadingSteps(false);
        }
      }
    };
    
    load();
    
    return () => {
      isCancelled = true;
    };
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action } = data;
    
    console.log('🎮 Joyride callback:', { status, action, step: data.index });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('🏁 Tour finished or skipped');
      setRun(false);
      setIsLoadingSteps(false);
      completeTour(currentVersion);
      
      const message = tourMode.includes('updates') 
        ? 'Novidades visualizadas' 
        : 'Tour concluído';
      toast.success(message);
    }

    // If user clicks outside or presses ESC
    if (action === ACTIONS.CLOSE) {
      console.log('❌ Tour closed by user');
      setRun(false);
      setIsLoadingSteps(false);
      completeTour(currentVersion);
    }
  };

  console.log('🎬 GuidedTour render:', { shouldShowTour, run, stepsCount: steps.length });
  
  if (!shouldShowTour) {
    console.log('⏸️ Tour should not show, returning null');
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      hideCloseButton={false}
      disableOverlayClose={false}
      spotlightPadding={8}
      floaterProps={{
        styles: {
          floater: {
            transition: 'opacity 0.4s ease-in-out, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      }}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
          arrowColor: 'transparent',
        },
        spotlight: {
          borderRadius: 12,
          border: '1px solid hsl(var(--primary) / 0.3)',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3), 0 0 40px hsl(var(--primary) / 0.3)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          transition: 'all 0.4s ease-in-out',
        },
        tooltip: {
          backgroundColor: 'hsl(var(--background) / 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid hsl(var(--border) / 0.5)',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 20px 60px -10px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--primary) / 0.1)',
          maxWidth: 420,
          animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        tooltipContainer: {
          textAlign: 'center',
        },
        tooltipContent: {
          padding: 0,
          color: 'hsl(var(--foreground))',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '400',
          transition: 'all 0.2s ease',
          border: 'none',
          letterSpacing: '0.3px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: 12,
          fontSize: '14px',
          fontWeight: '400',
          padding: '10px 20px',
          borderRadius: 10,
          transition: 'all 0.2s ease',
          letterSpacing: '0.3px',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '13px',
          fontWeight: '400',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          letterSpacing: '0.3px',
        },
        buttonClose: {
          display: 'none',
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
      callback={handleJoyrideCallback}
    />
  );
};
