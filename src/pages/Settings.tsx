import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { X, Plus, Edit2, Check } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', email: '' });
  const [settings, setSettings] = useState({ blur_enabled: false, sidebar_style: 'matte', initial_investment: 0 });
  const [setups, setSetups] = useState<{ id: string; name: string }[]>([]);
  const [newSetupName, setNewSetupName] = useState('');
  const [editingSetupId, setEditingSetupId] = useState<string | null>(null);
  const [editingSetupName, setEditingSetupName] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchSettings();
    fetchSetups();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile({ full_name: data.full_name || '', email: data.email || '' });
    }
  };

  const fetchSettings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setSettings({ 
        blur_enabled: data.blur_enabled, 
        sidebar_style: data.sidebar_style,
        initial_investment: data.initial_investment || 0
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
    }
  };

  const handleToggleBlur = async (checked: boolean) => {
    if (!user) return;

    setSettings({ ...settings, blur_enabled: checked });
    
    const { error } = await supabase
      .from('user_settings')
      .update({ blur_enabled: checked })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update setting');
    } else {
      toast.success('Setting updated!');
    }
  };

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('user_settings')
      .update({ initial_investment: settings.initial_investment })
      .eq('user_id', user.id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update initial investment');
    } else {
      toast.success('Initial investment updated!');
    }
  };

  const fetchSetups = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_setups')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    
    if (data && !error) {
      setSetups(data);
    }
  };

  const handleAddSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSetupName.trim()) return;

    const { error } = await supabase
      .from('user_setups')
      .insert({ user_id: user.id, name: newSetupName.trim() });

    if (error) {
      if (error.code === '23505') {
        toast.error('This setup already exists');
      } else {
        toast.error('Failed to add setup');
      }
    } else {
      toast.success('Setup added!');
      setNewSetupName('');
      fetchSetups();
    }
  };

  const handleUpdateSetup = async (id: string) => {
    if (!editingSetupName.trim()) return;

    const { error } = await supabase
      .from('user_setups')
      .update({ name: editingSetupName.trim() })
      .eq('id', id);

    if (error) {
      if (error.code === '23505') {
        toast.error('This setup name already exists');
      } else {
        toast.error('Failed to update setup');
      }
    } else {
      toast.success('Setup updated!');
      setEditingSetupId(null);
      setEditingSetupName('');
      fetchSetups();
    }
  };

  const handleDeleteSetup = async (id: string) => {
    const { error } = await supabase
      .from('user_setups')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete setup');
    } else {
      toast.success('Setup deleted!');
      fetchSetups();
    }
  };

  const startEditingSetup = (id: string, name: string) => {
    setEditingSetupId(id);
    setEditingSetupName(name);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                placeholder="Your name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={profile.email}
                disabled
                className="mt-1 opacity-50"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold mb-4">Trading Settings</h2>
          <form onSubmit={handleSaveInvestment} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Initial Investment</label>
              <Input
                type="number"
                step="0.01"
                value={settings.initial_investment}
                onChange={(e) => setSettings({...settings, initial_investment: parseFloat(e.target.value) || 0})}
                placeholder="Enter your starting capital"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">This is used to calculate your total ROI</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {loading ? 'Saving...' : 'Save Investment'}
            </Button>
          </form>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold mb-4">Trade Setups</h2>
          <p className="text-sm text-muted-foreground mb-4">Manage your custom trade setup tags. These will be available when logging trades.</p>
          
          <form onSubmit={handleAddSetup} className="mb-4">
            <div className="flex gap-2">
              <Input
                value={newSetupName}
                onChange={(e) => setNewSetupName(e.target.value)}
                placeholder="Enter new setup name (e.g., Breakout, Reversal)"
                className="flex-1"
              />
              <Button type="submit" disabled={!newSetupName.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </form>

          <div className="space-y-2">
            {setups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No setups yet. Add your first setup above.
              </p>
            ) : (
              setups.map((setup) => (
                <div key={setup.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  {editingSetupId === setup.id ? (
                    <>
                      <Input
                        value={editingSetupName}
                        onChange={(e) => setEditingSetupName(e.target.value)}
                        className="flex-1 h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateSetup(setup.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSetupId(null);
                          setEditingSetupName('');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="flex-1 justify-start">
                        {setup.name}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingSetup(setup.id, setup.name)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSetup(setup.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold mb-4">Display Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Blur Sensitive Data</p>
                <p className="text-sm text-muted-foreground">Hide financial numbers by default</p>
              </div>
              <Switch
                checked={settings.blur_enabled}
                onCheckedChange={handleToggleBlur}
              />
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
