import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, 
  LayoutDashboard, 
  MessageSquare, 
  CheckSquare, 
  Users,
  MapPin,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
  Menu,
  X,
  Bell,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/agency", icon: LayoutDashboard },
  { label: "Leads Inbox", href: "/agency/leads", icon: MessageSquare, badge: true },
  { label: "Tasks", href: "/agency/tasks", icon: CheckSquare },
  { label: "Team", href: "/agency/team", icon: Users },
  { label: "Coverage Areas", href: "/agency/coverage", icon: MapPin },
  { label: "Documents", href: "/agency/documents", icon: FileText },
  { label: "Reports", href: "/agency/reports", icon: BarChart3 },
  { label: "Profile", href: "/agency/profile", icon: Building2 },
  { label: "Settings", href: "/agency/settings", icon: Settings },
];

export default function AgencyWorkspace() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?redirect=/agency");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch agency owned by this user
  const { data: agency, isLoading: agencyLoading } = useQuery({
    queryKey: ["user-agency", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch workspace
  const { data: workspace } = useQuery({
    queryKey: ["agency-workspace", agency?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_workspaces")
        .select("*")
        .eq("agency_id", agency?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Fetch unread leads count
  const { data: unreadLeadsCount } = useQuery({
    queryKey: ["unread-leads-count", agency?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("source_agency_id", agency?.id)
        .eq("is_viewed", false);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!agency?.id,
  });

  if (loading || agencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // If user doesn't have an agency, show claim/register prompt
  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Welcome to Agency Workspace</h1>
          <p className="text-muted-foreground mb-8">
            You need to claim or register an agency to access the workspace. This gives you full control over your agency profile, leads, and team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="rounded-full">
              <Link to="/claim">Claim Your Agency</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/register-agency">Register New Agency</Link>
            </Button>
          </div>
          <Button variant="link" onClick={() => navigate("/")} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Agency Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {agency.logo_url ? (
            <img
              src={agency.logo_url}
              alt={agency.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate">{agency.name}</h2>
            <StatusBadge 
              variant={agency.is_verified ? "verified" : "unclaimed"} 
              className="mt-0.5"
              showIcon={false}
            >
              {agency.is_verified ? "Verified" : "Unclaimed"}
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && unreadLeadsCount && unreadLeadsCount > 0 && (
                <span className="bg-warm text-warm-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadLeadsCount}
                </span>
              )}
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!agency.is_featured && (
        <div className="p-3">
          <div className="bg-gradient-to-br from-primary/10 to-warm/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">Upgrade</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get featured listings, priority support, and advanced analytics.
            </p>
            <Button size="sm" className="w-full rounded-full text-xs">
              View Plans
            </Button>
          </div>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.email}</p>
            <p className="text-[10px] text-muted-foreground">Agency Owner</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-bold text-lg">
              {navItems.find(item => item.href === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadLeadsCount && unreadLeadsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-warm text-warm-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadLeadsCount > 9 ? "9+" : unreadLeadsCount}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full hidden sm:flex" asChild>
              <Link to={`/agencies/${agency.slug}`}>
                View Public Profile
              </Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet context={{ agency, workspace, user }} />
        </main>
      </div>
    </div>
  );
}
