import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtractedTrade } from '@/types/trade';

interface DebugData {
  timestamp: string;
  request: {
    imageSize: number;
    imageName: string;
    broker: string;
  };
  rawResponse: any;
  error: any;
  processedTrades: ExtractedTrade[];
  debugInfo?: {
    rawAIResponse?: string;
    parsedTradesCount?: number;
    validatedTradesCount?: number;
    validationFailures?: number;
    model?: string;
    timestamp?: string;
  };
}

interface DebugDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debugData: DebugData | null;
}

export function DebugDataModal({ open, onOpenChange, debugData }: DebugDataModalProps) {
  if (!debugData) return null;

  const copyToClipboard = (data: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success(`${label} copied to clipboard`);
  };

  const downloadDebugData = () => {
    const dataStr = JSON.stringify(debugData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `debug-${debugData.request.imageName}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Debug data downloaded');
  };

  const validationStatus = debugData.error 
    ? 'error' 
    : debugData.processedTrades.length === 0 
    ? 'warning' 
    : 'success';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Debug Data</span>
            {validationStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {validationStatus === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {validationStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          </DialogTitle>
          <DialogDescription>
            Detailed extraction data for {debugData.request.imageName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Request Info */}
            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                Request Information
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugData.request, 'Request info')}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                <div>
                  <span className="text-muted-foreground">Image:</span>
                  <p className="font-medium truncate">{debugData.request.imageName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <p className="font-medium">{(debugData.request.imageSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Broker:</span>
                  <p className="font-medium">{debugData.request.broker}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p className="font-medium">{new Date(debugData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Statistics */}
            {debugData.debugInfo && (
              <>
                <section>
                  <h3 className="text-sm font-semibold mb-2">Extraction Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{debugData.debugInfo.parsedTradesCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Parsed</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-500">{debugData.debugInfo.validatedTradesCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Validated</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-500">{debugData.debugInfo.validationFailures || 0}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <p className="text-xs font-medium text-muted-foreground truncate">{debugData.debugInfo.model || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Model</p>
                    </div>
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Error Section */}
            {debugData.error && (
              <>
                <section>
                  <h3 className="text-sm font-semibold mb-2 text-red-500 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Error Details
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(debugData.error, 'Error')}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </h3>
                  <pre className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(debugData.error, null, 2)}
                  </pre>
                </section>
                <Separator />
              </>
            )}

            {/* Processed Trades */}
            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                Processed Trades ({debugData.processedTrades.length})
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugData.processedTrades, 'Processed trades')}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </h3>
              {debugData.processedTrades.length > 0 ? (
                <div className="space-y-2">
                  {debugData.processedTrades.map((trade, idx) => (
                    <div key={idx} className="bg-muted/50 p-3 rounded-lg text-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={trade.side === 'long' ? 'default' : 'secondary'}>
                          {trade.side?.toUpperCase()}
                        </Badge>
                        <span className="font-semibold">{trade.symbol}</span>
                        <Badge variant={trade.profit_loss >= 0 ? 'default' : 'destructive'}>
                          {trade.profit_loss?.toFixed(2) || 'N/A'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                        <div>Entry: {trade.entry_price || 'N/A'}</div>
                        <div>Exit: {trade.exit_price || 'N/A'}</div>
                        <div>Margin: {trade.margin || 'N/A'}</div>
                        <div>Leverage: {trade.leverage || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No trades extracted</p>
              )}
            </section>

            <Separator />

            {/* Raw Response */}
            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                Raw AI Response
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(debugData.rawResponse, 'Raw response')}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </h3>
              <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                {JSON.stringify(debugData.rawResponse, null, 2)}
              </pre>
            </section>

            {/* Raw AI Text Response */}
            {debugData.debugInfo?.rawAIResponse && (
              <>
                <Separator />
                <section>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    Raw AI Text Response
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(debugData.debugInfo?.rawAIResponse, 'Raw AI text')}
                      className="h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </h3>
                  <pre className="bg-muted/50 p-3 rounded-lg text-xs overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                    {debugData.debugInfo.rawAIResponse}
                  </pre>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={downloadDebugData}>
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
