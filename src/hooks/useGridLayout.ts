import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WidgetPosition {
  id: string;
  column: number;
  row: number;
}

const DEFAULT_POSITIONS: WidgetPosition[] = [
  { id: 'totalBalance', column: 0, row: 0 },
  { id: 'winRate', column: 1, row: 0 },
  { id: 'totalTrades', column: 2, row: 0 },
  { id: 'portfolioOverview', column: 0, row: 1 },
  { id: 'spotWallet', column: 1, row: 1 },
  { id: 'topMovers', column: 2, row: 1 },
  { id: 'recentTransactions', column: 0, row: 2 },
  { id: 'quickActions', column: 1, row: 2 },
  { id: 'capitalGrowth', column: 0, row: 3 },
  { id: 'avgPnLPerTrade', column: 1, row: 3 },
  { id: 'avgPnLPerDay', column: 2, row: 3 },
  { id: 'currentROI', column: 0, row: 4 },
  { id: 'avgROIPerTrade', column: 1, row: 4 },
];

export const useGridLayout = (userId: string | undefined, availableWidgets: string[]) => {
  const [positions, setPositions] = useState<WidgetPosition[]>(DEFAULT_POSITIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadLayout = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('layout_json')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error loading layout:', error);
          return;
        }

        if (data?.layout_json) {
          const layoutData = data.layout_json as any;
          
          // Handle new position-based format
          if (Array.isArray(layoutData) && layoutData[0]?.column !== undefined) {
            setPositions(layoutData);
          }
          // Handle old order-based format - convert to positions
          else if (Array.isArray(layoutData) && typeof layoutData[0] === 'string') {
            const newPositions = layoutData.map((id: string, idx: number) => ({
              id,
              column: idx % 3,
              row: Math.floor(idx / 3),
            }));
            setPositions(newPositions);
          }
        }
      } catch (error) {
        console.error('Failed to load layout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
  }, [userId]);

  const saveLayout = useCallback(async (newPositions: WidgetPosition[]) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          layout_json: newPositions as any,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('Layout saved');
    } catch (error) {
      console.error('Failed to save layout:', error);
      toast.error('Failed to save layout');
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const updatePosition = useCallback((widgetId: string, column: number, row: number) => {
    setPositions(prev => {
      const filtered = prev.filter(p => p.id !== widgetId);
      return [...filtered, { id: widgetId, column, row }];
    });
  }, []);

  const addWidget = useCallback((widgetId: string) => {
    if (positions.find(p => p.id === widgetId)) {
      toast.info('Widget already added');
      return;
    }

    const maxRow = Math.max(0, ...positions.map(p => p.row));
    const newPositions = [...positions, { id: widgetId, column: 0, row: maxRow + 1 }];
    setPositions(newPositions);
    saveLayout(newPositions);
    toast.success('Widget added');
  }, [positions, saveLayout]);

  const removeWidget = useCallback((widgetId: string) => {
    const newPositions = positions.filter(p => p.id !== widgetId);
    setPositions(newPositions);
    saveLayout(newPositions);
    toast.success('Widget removed');
  }, [positions, saveLayout]);

  const resetLayout = useCallback(() => {
    setPositions(DEFAULT_POSITIONS);
    saveLayout(DEFAULT_POSITIONS);
    toast.success('Layout reset');
  }, [saveLayout]);

  return {
    positions,
    isLoading,
    isSaving,
    updatePosition,
    saveLayout,
    addWidget,
    removeWidget,
    resetLayout,
  };
};
