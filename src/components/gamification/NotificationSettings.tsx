import { memo } from 'react';
import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationSettings = memo(() => {
  const { requestPermission } = usePushNotifications();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>('default');
  const isSupported = 'Notification' in window;

  React.useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  }, [isSupported]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setPermission('granted');
      setIsEnabled(true);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-6 glass-soft">
        <div className="flex items-center gap-3 text-muted-foreground">
          <BellOff className="w-5 h-5" />
          <p>Push notifications are not supported in your browser.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-soft">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <Label htmlFor="notifications" className="text-base font-semibold">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about achievements, rewards, and challenges
              </p>
            </div>
          </div>
          <Switch
            id="notifications"
            checked={isEnabled}
            disabled={permission === 'denied'}
            onCheckedChange={(checked) => {
              if (checked && !isEnabled) {
                handleRequestPermission();
              }
            }}
          />
        </div>

        {permission === 'denied' && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {permission === 'default' && (
          <Button onClick={handleRequestPermission} variant="outline" className="w-full">
            Enable Notifications
          </Button>
        )}
      </div>
    </Card>
  );
});

NotificationSettings.displayName = 'NotificationSettings';
