import { useEffect, useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from 'react-joyride';
import { useGuidedTour, TourMode } from '@/hooks/useGuidedTour';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const fullTourSteps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          Bem-vindo ao Tour Guiado
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed text-center">
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Personalize seu Dashboard</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Reorganize widgets, adicione novos gráficos e crie uma visualização perfeita para o seu estilo de trading.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="theme-toggle"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Modo Claro/Escuro e Cores</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Alterne entre tema claro e escuro, personalize as cores da interface e ajuste o contraste para uma experiência visual perfeita.
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Escolha entre diversos esquemas de cores e encontre o visual ideal para o seu momento de trading.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="portfolio-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Portfólio</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Gerencie seus ativos e contas:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Spot Wallet</span> — Visualize saldo total, distribuição de tokens e alocação de ativos</p>
          
          <p><span className="font-bold text-foreground">Exchanges</span> — Conecte APIs da Binance, Bybit, OKX para sincronização automática</p>
          
          <p><span className="font-bold text-foreground">Trading Accounts</span> — Gerencie múltiplas contas e acompanhe capital inicial por conta</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="trades-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Operações</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Registre e analise suas operações:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Adicionar Trade</span> — Importe CSVs ou adicione operações manualmente</p>
          
          <p><span className="font-bold text-foreground">Trade Analysis</span> — Análise detalhada de performance, win rate e padrões de trading</p>
          
          <p><span className="font-bold text-foreground">Fee Analysis</span> — Acompanhe custos, taxas e otimize eficiência operacional</p>
          
          <p><span className="font-bold text-foreground">Risk Management</span> — Calculadora de position size, controle de drawdown e limites</p>
          
          <p><span className="font-bold text-foreground">Trading Journal</span> — Registre observações, lições aprendidas e insights</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="analytics-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Análises</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Dados e insights em tempo real:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Market Data</span> — Dados em tempo real de criptomoedas e métricas de mercado</p>
          
          <p><span className="font-bold text-foreground">Forecast</span> — Projeções e simulações baseadas em IA para planejar metas</p>
          
          <p><span className="font-bold text-foreground">Economic Calendar</span> — Eventos macroeconômicos e impactos no mercado crypto</p>
          
          <p><span className="font-bold text-foreground">Performance Alerts</span> — Notificações automáticas sobre métricas e thresholds</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="planning-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Planejamento</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Estruture sua estratégia de trading:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Trading Plan</span> — Defina regras, estratégias e checklists de entrada/saída</p>
          
          <p><span className="font-bold text-foreground">Goals</span> — Estabeleça objetivos, acompanhe progresso e celebre conquistas</p>
          
          <p><span className="font-bold text-foreground">Psychology</span> — Monitore estado emocional, identifique padrões e melhore disciplina</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="reports-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Relatórios</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Documentação e análise de performance:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Reports</span> — Gere relatórios mensais, semanais ou personalizados automaticamente</p>
          
          <p><span className="font-bold text-foreground">Tax Reports</span> — Documentação fiscal, cálculo de ganhos de capital e conformidade</p>
          
          <p><span className="font-bold text-foreground">My Metrics</span> — Crie KPIs personalizados e benchmarks específicos para seu estilo</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="community-group"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Comunidade</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Conecte-se e evolua com outros traders:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Social</span> — Feed social para compartilhar estratégias e resultados</p>
          
          <p><span className="font-bold text-foreground">Leaderboard</span> — Rankings de performance entre traders da plataforma</p>
          
          <p><span className="font-bold text-foreground">Achievements</span> — Badges, conquistas e sistema de gamificação</p>
          
          <p><span className="font-bold text-foreground">Progress XP</span> — Sistema de níveis, experiência e recompensas por consistência</p>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="user-guide"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Guia do Usuário</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Acesse tutoriais completos, documentação e dicas de uso da plataforma.
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Aprenda sobre cada funcionalidade através de guias passo a passo, vídeos explicativos e melhores práticas de uso. Sempre disponível para consulta rápida.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="market-data-widget"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Market Data</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Acompanhe dados de mercado em tempo real:
        </p>
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p><span className="font-bold text-foreground">Long/Short Ratio</span> — Sentimento institucional do mercado</p>
          
          <p><span className="font-bold text-foreground">Live Prices</span> — Cotações atualizadas de BTC, ETH e principais altcoins</p>
          
          <p><span className="font-bold text-foreground">Open Interest</span> — Volume de contratos futuros abertos</p>
          
          <p><span className="font-bold text-foreground">Fear & Greed Index</span> — Sentimento geral do mercado</p>
        </div>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="live-prices"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Live Prices — Personalize Seus Ativos</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Visualize cotações em tempo real das suas criptomoedas favoritas.
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Clique para adicionar ou remover ativos da sua watchlist, reordene conforme sua preferência e acompanhe variações percentuais, volume 24h e capitalização de mercado de forma instantânea.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="settings-capital"]',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Configure seu Capital Inicial</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Defina o valor do seu capital inicial para cálculos precisos de ROI e desempenho. Este valor pode ser editado a qualquer momento.
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Ao adicionar mais capital, o sistema calculará automaticamente a <span className="font-bold text-foreground">média ponderada</span> considerando as datas de depósito, garantindo métricas sempre atualizadas e proporcionais ao seu investimento real.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: 'body',
    content: (
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          Pronto para começar
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed text-center">
          Você agora conhece todas as principais funcionalidades da plataforma.
        </p>
        <p className="text-[15px] text-muted-foreground leading-relaxed text-center">
          Explore e leve seu trading para o próximo nível.
        </p>
        <p className="text-[13px] text-muted-foreground/70 mt-6 pt-5 border-t border-border/30 text-center leading-relaxed">
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
      spotlightPadding={12}
      disableScrolling={false}
      scrollOffset={100}
      floaterProps={{
        disableAnimation: false,
        styles: {
          floater: {
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          arrow: {
            length: 8,
            spread: 12,
          },
        },
      }}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
          arrowColor: 'hsl(var(--background) / 0.95)',
        },
        spotlight: {
          borderRadius: 16,
          border: '2px solid hsl(var(--primary) / 0.4)',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3), 0 0 60px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.1)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        tooltip: {
          backgroundColor: 'hsl(var(--background) / 0.95)',
          backdropFilter: 'blur(24px) saturate(200%)',
          border: '1.5px solid hsl(var(--border) / 0.6)',
          borderRadius: 20,
          padding: '32px 36px',
          boxShadow: `
            0 24px 72px -12px hsl(var(--primary) / 0.25),
            0 0 0 1px hsl(var(--primary) / 0.15),
            inset 0 1px 0 0 hsl(var(--background) / 0.8),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)
          `,
          maxWidth: 440,
          minWidth: 320,
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        tooltipContainer: {
          textAlign: 'left',
          lineHeight: '1.7',
        },
        tooltipContent: {
          padding: 0,
          color: 'hsl(var(--foreground))',
          fontSize: '15px',
          fontWeight: '400',
          letterSpacing: '0.01em',
        },
        tooltipTitle: {
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px',
          lineHeight: '1.4',
          letterSpacing: '-0.01em',
        },
        tooltipFooter: {
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid hsl(var(--border) / 0.3)',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '14.5px',
          fontWeight: '500',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: 'none',
          letterSpacing: '0.02em',
          boxShadow: '0 4px 12px hsl(var(--primary) / 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
          outline: 'none',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          backgroundColor: 'hsl(var(--muted) / 0.5)',
          marginRight: 12,
          fontSize: '14.5px',
          fontWeight: '500',
          padding: '12px 24px',
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '0.02em',
          border: '1px solid hsl(var(--border) / 0.3)',
          outline: 'none',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '13.5px',
          fontWeight: '500',
          padding: '10px 18px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '0.02em',
          outline: 'none',
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
