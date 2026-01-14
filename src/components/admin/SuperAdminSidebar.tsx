import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Users,
  MessageSquare,
  Star,
  FileText,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  CreditCard,
  BarChart3,
  Shield,
  HelpCircle,
  Globe,
  Layers,
  Sparkles,
  Bell,
  Search,
  Zap,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Directory",
    items: [
      { name: "Agencies", href: "/admin/agencies", icon: Building2, badge: "agencies" },
      { name: "Locations", href: "/admin/locations", icon: MapPin },
      { name: "Specialisms", href: "/admin/specialisms", icon: Sparkles },
      { name: "Coverage Areas", href: "/admin/agency-locations", icon: Layers },
    ],
  },
  {
    label: "Growth & Leads",
    items: [
      { name: "Leads", href: "/admin/leads", icon: MessageSquare, badge: "leads" },
      { name: "Reviews", href: "/admin/reviews", icon: Star, badge: "reviews" },
      { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "CMS Pages", href: "/admin/cms", icon: Globe },
      { name: "Blog", href: "/admin/blog", icon: FileText },
      { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { name: "Content Blocks", href: "/admin/content", icon: Layers },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Users & Roles", href: "/admin/users", icon: Users },
      { name: "Site Settings", href: "/admin/settings", icon: Settings },
      { name: "Security", href: "/admin/security", icon: Shield },
      { name: "GMB Import", href: "/admin/gmb-import", icon: Zap },
    ],
  },
];

interface SuperAdminSidebarProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function SuperAdminSidebar({ children, title, description }: SuperAdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  // Fetch badge counts
  const { data: badgeCounts } = useQuery({
    queryKey: ["admin-badge-counts"],
    queryFn: async () => {
      const [pendingReviews, newLeads, totalAgencies] = await Promise.all([
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("agencies").select("*", { count: "exact", head: true }),
      ]);
      return {
        reviews: pendingReviews.count || 0,
        leads: newLeads.count || 0,
        agencies: totalAgencies.count || 0,
      };
    },
    refetchInterval: 30000,
  });

  const getBadgeCount = (badge?: string) => {
    if (!badge || !badgeCounts) return null;
    const count = badgeCounts[badge as keyof typeof badgeCounts];
    if (badge === "agencies") return null; // Don't show badge for total count
    return count > 0 ? count : null;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold text-sm shadow-soft">
            FC
          </div>
          <div>
            <span className="font-bold text-base">Foster Care UK</span>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                const badgeCount = getBadgeCount(item.badge);
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {badgeCount && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-5 min-w-5 justify-center",
                          isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-warm/10 text-warm"
                        )}
                      >
                        {badgeCount}
                      </Badge>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground rounded-xl"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border hidden lg:block z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="font-bold">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="w-5 h-5" />
            {(badgeCounts?.leads || 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-warm text-warm-foreground text-[10px] rounded-full flex items-center justify-center">
                {badgeCounts?.leads}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="p-5 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/admin" className="hover:text-foreground transition-colors">
                Admin
              </Link>
              {location.pathname !== "/admin" && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground font-medium">{title}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
