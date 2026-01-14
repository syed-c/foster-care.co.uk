import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Search, 
  Eye,
  User,
  Calendar,
  Activity,
  Loader2,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";

const ACTION_TYPES = [
  { value: "all", label: "All Actions" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "verify", label: "Verify" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
];

const ENTITY_TYPES = [
  { value: "all", label: "All Entities" },
  { value: "agency", label: "Agencies" },
  { value: "location", label: "Locations" },
  { value: "review", label: "Reviews" },
  { value: "lead", label: "Leads" },
  { value: "user", label: "Users" },
  { value: "content", label: "Content" },
  { value: "settings", label: "Settings" },
];

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Fetch audit logs
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit-logs", actionFilter, entityFilter],
    queryFn: async () => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter);
      }
      if (entityFilter !== "all") {
        query = query.eq("entity_type", entityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Filter logs by search
  const filteredLogs = logs?.filter((log) => {
    if (!searchQuery) return true;
    return (
      log.actor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return <Badge className="bg-verified/10 text-verified border-0">Create</Badge>;
      case "update":
        return <Badge className="bg-primary/10 text-primary border-0">Update</Badge>;
      case "delete":
        return <Badge className="bg-destructive/10 text-destructive border-0">Delete</Badge>;
      case "verify":
      case "approve":
        return <Badge className="bg-verified/10 text-verified border-0">{action}</Badge>;
      case "reject":
        return <Badge className="bg-warm/10 text-warm border-0">Reject</Badge>;
      case "login":
      case "logout":
        return <Badge variant="secondary">{action}</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "agency":
        return <Activity className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      case "content":
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <SuperAdminSidebar title="Audit Logs" description="Track all system activities and changes">
      <div className="space-y-6">
        {/* Filters */}
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, entity, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[160px] rounded-xl">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[160px] rounded-xl">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>
              {filteredLogs?.length || 0} entries found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs?.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30">
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm truncate max-w-[150px]">
                              {log.actor_email || "System"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEntityIcon(log.entity_type)}
                            <span className="text-sm capitalize">{log.entity_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm font-mono">
                          {log.ip_address || "—"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!filteredLogs || filteredLogs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Details Dialog */}
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Audit Log Details
              </DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedLog.created_at), "MMM d, yyyy HH:mm:ss")}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Action</p>
                    {getActionBadge(selectedLog.action)}
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
                    <p className="text-sm font-medium capitalize">{selectedLog.entity_type}</p>
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Entity ID</p>
                    <p className="text-sm font-mono truncate">{selectedLog.entity_id || "—"}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border">
                  <p className="text-xs text-muted-foreground mb-1">Actor</p>
                  <p className="text-sm">{selectedLog.actor_email || "System"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {selectedLog.actor_id || "—"}
                  </p>
                </div>

                <div className="p-3 rounded-xl border">
                  <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                  <p className="text-sm font-mono">{selectedLog.ip_address || "Not recorded"}</p>
                </div>

                {selectedLog.user_agent && (
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                    <p className="text-xs font-mono break-all">{selectedLog.user_agent}</p>
                  </div>
                )}

                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-2">Changes</p>
                    <ScrollArea className="h-[150px]">
                      <pre className="text-xs font-mono bg-muted p-2 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedLog.changes, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full rounded-xl"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminSidebar>
  );
}
