import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserRound, Shield, Plus, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type Role = "admin" | "moderator" | "agency" | "foster_parent" | "user";

const ALL_ROLES: Role[] = ["admin", "moderator", "agency", "foster_parent", "user"];

interface ProfileRow {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface UserRoleRow {
  id: string;
  user_id: string;
  role: Role;
}

interface UserRow {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  roles: { id: string; role: Role }[];
  created_at: string;
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role | "">("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,user_id,email,full_name,phone,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("id,user_id,role"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const profiles = (profilesRes.data || []) as ProfileRow[];
      const roles = (rolesRes.data || []) as UserRoleRow[];

      const rolesByUser = new Map<string, { id: string; role: Role }[]>();
      for (const r of roles) {
        const existing = rolesByUser.get(r.user_id) || [];
        rolesByUser.set(r.user_id, [...existing, { id: r.id, role: r.role }]);
      }

      const rows: UserRow[] = profiles.map((p) => ({
        user_id: p.user_id,
        full_name: (p.full_name || "").trim() || "—",
        email: (p.email || "").trim() || "—",
        phone: (p.phone || "").trim() || "—",
        roles: rolesByUser.get(p.user_id) || [],
        created_at: p.created_at,
      }));

      return rows;
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role added successfully");
      setNewRole("");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add role: ${error.message}`);
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role removed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove role: ${error.message}`);
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data || [];

    return (data || []).filter((u) => {
      const rolesText = u.roles.map((r) => r.role).join(" ").toLowerCase();
      return (
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        rolesText.includes(q)
      );
    });
  }, [data, search]);

  const openRoleDialog = (user: UserRow) => {
    setSelectedUser(user);
    setNewRole("");
    setIsDialogOpen(true);
  };

  const handleAddRole = () => {
    if (!selectedUser || !newRole) return;
    addRoleMutation.mutate({ userId: selectedUser.user_id, role: newRole });
  };

  const handleRemoveRole = (roleId: string) => {
    removeRoleMutation.mutate(roleId);
  };

  const availableRoles = selectedUser
    ? ALL_ROLES.filter((r) => !selectedUser.roles.some((ur) => ur.role === r))
    : ALL_ROLES;

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      case "agency":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <SuperAdminSidebar title="Users" description="Manage user profiles and roles">
      <Card className="border-border/50 shadow-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Users
          </CardTitle>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users (name, email, role)…"
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading users…
            </div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">Failed to load users.</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No users found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.user_id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {u.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {u.roles.map((r) => (
                            <Badge key={r.id} variant={getRoleBadgeVariant(r.role)} className="capitalize">
                              {r.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                              {r.role.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No roles</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.phone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(u.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(u)}
                        className="gap-1.5"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Manage Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Manage Roles
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-medium">{selectedUser.full_name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>

              {/* Current Roles */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Current Roles</p>
                {selectedUser.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.roles.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm"
                      >
                        <span className="capitalize">{r.role.replace("_", " ")}</span>
                        <button
                          onClick={() => handleRemoveRole(r.id)}
                          disabled={removeRoleMutation.isPending}
                          className="p-0.5 hover:bg-destructive/10 rounded-full transition-colors"
                        >
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No roles assigned</p>
                )}
              </div>

              {/* Add New Role */}
              {availableRoles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Add Role</p>
                  <div className="flex gap-2">
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role} className="capitalize">
                            {role.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddRole}
                      disabled={!newRole || addRoleMutation.isPending}
                      size="icon"
                    >
                      {addRoleMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}
