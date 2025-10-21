import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BarChart3, TrendingUp, Target, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function SidebarQuickLinks() {
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "hover:bg-accent/50 hover:text-accent-foreground";

  const quickLinks = [
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/forecast', icon: TrendingUp, label: 'Forecast' },
    { to: '/achievements', icon: Target, label: 'Goals' },
    { to: '/ai-tools', icon: Sparkles, label: 'AI Tools' },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {quickLinks.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild tooltip={link.label}>
                <NavLink to={link.to} end className={getNavCls}>
                  <link.icon className="mr-2 h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
